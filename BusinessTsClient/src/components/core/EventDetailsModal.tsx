import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchDeleteEvent } from '../../store/feature/eventSlice';


export interface EventData {
    id?: string; 
    title?: string;
    startTime?: string | Date; 
    endTime?: string | Date;   
}


interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventData: EventData | null; 
    onUpdateEvent: (eventData: EventData) => void; 
}


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// Functional component definition
const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, eventData, onUpdateEvent }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    useEffect(() => {
        if (eventData) {
            setTitle(eventData.title || '');

           
            const startDate = new Date(eventData.startTime as string);
            const endDate = new Date(eventData.endTime as string);

            
            const localStartDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000));
            const localEndDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000));

            
            setStartTime(localStartDate.toISOString().slice(0, 16)); 
            setEndTime(localEndDate.toISOString().slice(0, 16)); 
        }
    }, [eventData]);

    const handleUpdate = () => {
        if (eventData?.id) { 
            onUpdateEvent({
                id: eventData.id, 
                title,
                startTime,
                endTime,
            });
            onClose();
        }
    };

    const handleDelete = async () => {
        if (eventData && eventData.id) {
            try {
                const payload = { token: localStorage.getItem('token') || '', id: eventData.id };
                await dispatch(fetchDeleteEvent(payload)).unwrap();
                onClose();
                window.location.reload();  // İsteğe bağlı olarak sayfa yenileyebiliriz
            } catch (error) {
                console.error("Etkinlik silinirken hata oluştu:", error);
            }
        }
    };

    if (!eventData) return null; // eventData yoksa render etme

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="h2">
                        Etkinlik Detayları
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <TextField
                    label="Başlık"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Başlangıç Zamanı"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Bitiş Zamanı"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Güncelle
                </Button>
                <Button onClick={handleDelete} variant="contained" color="error" sx={{ mt: 2, ml: 1 }}>
                    Sil
                </Button>
            </Box>
        </Modal>
    );
};

export default EventDetailsModal;
