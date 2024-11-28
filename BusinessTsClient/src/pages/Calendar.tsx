import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import EventModal from '../components/core/EventModal';
import { IEvent } from "../model/IEvent";
import {
    fetchGetEventById,
    fetchAcceptInvite,
    fetchDeleteEventByCreator,
    fetchDeleteByInvitee,
    fetchSaveEvent,
    fetchExtractAuthId
} from '../store/feature/eventSlice';
import { EventContentArg } from '@fullcalendar/core';
import { Button, Box, Typography, List, ListItem, Divider } from '@mui/material';

function Calendar() {
    const dispatch = useDispatch<AppDispatch>();
    const [eventList, setEventList] = useState<IEvent[]>([]);
    const [pendingInvites, setPendingInvites] = useState<IEvent[]>([]);
    const [activeEvents, setActiveEvents] = useState<IEvent[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // Eventleri Fetch Etme Fonksiyonu
    const fetchEvents = async () => {
        try {
            const response = await dispatch(fetchGetEventById()).unwrap();
            if (response.code === 200) {
                const events = response.data;
                setEventList(events);
                setPendingInvites(events.filter((event: IEvent) => event.status === 'PENDING'));
                setActiveEvents(events.filter((event: IEvent) => event.status === 'ACTIVE'));
            } else {
                console.error("Etkinlikler alınırken hata oluştu, yanıt kodu:", response.code);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [dispatch]);

    // Davet Kabul Etme
    const handleAcceptInvite = async (event: IEvent) => {
        try {
            await dispatch(fetchAcceptInvite(event.id)).unwrap();

            // Davet kabul edildikten sonra manuel olarak güncelleme yapın
            setPendingInvites((prev) => prev.filter((e) => e.id !== event.id));
            setActiveEvents((prev) => [...prev, { ...event, status: 'ACTIVE' }]);
            await fetchEvents();
        } catch (error) {
            console.error("Failed to accept invite:", error);
        }
    };


    // Etkinlik Silme
    const handleDeleteEvent = async (event: IEvent) => {
        try {
            const authId = await dispatch(fetchExtractAuthId()).unwrap();
            if (event.authId === authId) {
                await dispatch(fetchDeleteEventByCreator(event.id)).unwrap();
            } else {
                await dispatch(fetchDeleteByInvitee(event.id)).unwrap();
            }

            // Etkinlik silindikten sonra manuel olarak güncelleme yapın
            setPendingInvites((prev) => prev.filter((e) => e.id !== event.id));
            setActiveEvents((prev) => prev.filter((e) => e.id !== event.id));
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    // Yeni etkinlik oluşturma işlemi
    const handleEventSubmit = async (eventData: { title: string; startTime: Date; endTime: Date; description: string; location: string; invitedUserIds: number[]; }) => {
        await dispatch(fetchSaveEvent({
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            startDateTime: eventData.startTime,
            endDateTime: eventData.endTime,
            invitedUserIds: eventData.invitedUserIds
        })).unwrap();

        setModalOpen(false);
        fetchEvents(); // Yeni bir etkinlik eklendikten sonra etkinlikleri tekrar getir
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '100%', maxWidth: '1100px', mb: 4 }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    customButtons={{
                        btn: {
                            text: "Etkinlik Oluştur",
                            click: () => setModalOpen(true)
                        }
                    }}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "btn dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="dayGridMonth"
                    selectable={true}
                    editable={true}
                    dayMaxEvents={true}
                    locales={allLocales}
                    firstDay={1}
                    locale={"tr"}
                    height="auto"
                    events={activeEvents.map(event => ({
                        ...event,
                        start: new Date(event.startDateTime),
                        end: new Date(event.endDateTime),
                        id: event.id.toString(),
                    }))}
                />
            </Box>

            <Box sx={{ maxWidth: '1100px', width: '100%', p: 2, bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" gutterBottom>Davet Edildiğiniz Etkinlikler</Typography>
                {pendingInvites.length === 0 ? (
                    <Typography variant="body2">Davet edildiğiniz etkinlik bulunmamaktadır.</Typography>
                ) : (
                    <List>
                        {pendingInvites.map((event) => (
                            <ListItem key={event.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pb: 2 }}>
                                <Typography variant="subtitle1" component="div"><strong>{event.title}</strong></Typography>
                                <Typography variant="body2">{event.description}</Typography>
                                <Typography variant="body2">{event.location}</Typography>
                                <Typography variant="body2">{new Date(event.startDateTime).toLocaleString()} - {new Date(event.endDateTime).toLocaleString()}</Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleAcceptInvite(event)}>Kabul Et</Button>
                                    <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteEvent(event)}>Sil</Button>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Onaylanan Etkinlikler</Typography>
                {activeEvents.length === 0 ? (
                    <Typography variant="body2">Onaylanmış etkinlik bulunmamaktadır.</Typography>
                ) : (
                    <List>
                        {activeEvents.map(event => (
                            <ListItem key={event.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pb: 2 }}>
                                <Typography variant="subtitle1" component="div"><strong>{event.title}</strong></Typography>
                                <Typography variant="body2">{event.description}</Typography>
                                <Typography variant="body2">{event.location}</Typography>
                                <Typography variant="body2">{new Date(event.startDateTime).toLocaleString()} - {new Date(event.endDateTime).toLocaleString()}</Typography>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <EventModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleEventSubmit}
            />
        </Box>
    );
}

export default Calendar;
