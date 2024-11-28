// Gerekli bağımlılıkları içe aktar
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IEvent } from "../../model/IEvent";
import { IResponse } from "../../model/IResponse";
import RestApis from "../../config/RestApis";
import axios, { AxiosError } from "axios";


// Başlangıç durumu arayüzünü tanımla
interface IEventState {
    token: string;
    eventList: IEvent[];
    isLoading: boolean;
    authId?: number;
}

// Başlangıç durumu ayarla
const initialEventState: IEventState = {
    token: localStorage.getItem("token") || "",
    eventList: [],
    isLoading: false,
};

// API yüklerini temsil eden arayüzleri tanımla
interface IFetchSaveEvent {
    title: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    invitedUserIds: number[];
}

export interface IFetchUpdateEvent {
    id: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
}
interface IErrorResponse {
    code: number;
    message: string;
}

// Token alma işlemi için yardımcı fonksiyon
const getToken = () => localStorage.getItem("token") || "";

// Auth ID'yi almak için asenkron thunk
export const fetchExtractAuthId = createAsyncThunk(
    "event/fetchExtractAuthId",
    async () => {
        const response = await axios.get(
            `${RestApis.calendar_and_planning_service_event}/extract-auth-id`,
            {
                headers: { "Content-Type": "application/json" },
                params: { token: getToken() },
            }
        );
        console.log(getToken());
        return response.data;
    }
);

// Etkinlik kaydetme asenkron thunk
export const fetchSaveEvent = createAsyncThunk(
    "event/fetchSaveEvent",
    async (payload: IFetchSaveEvent) => {
        const response = await axios.post(
            `${RestApis.calendar_and_planning_service_event}/save-event`,
            { token: getToken(), ...payload },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    }
);

// Etkinlik güncelleme asenkron thunk
export const fetchUpdateEvent = createAsyncThunk(
    "event/fetchUpdateEvent",
    async (payload: IFetchUpdateEvent) => {
        const response = await axios.put(
            `${RestApis.calendar_and_planning_service_event}/update-event`,
            { token: getToken(), ...payload },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    }
);

// Etkinliği oluşturucu tarafından silme asenkron thunk
export const fetchDeleteEventByCreator = createAsyncThunk(
    "event/fetchDeleteEventByCreator",
    async (id: number) => {
        const response = await axios.delete(
            `${RestApis.calendar_and_planning_service_event}/delete-event-by-creator`,
            {
                headers: { "Content-Type": "application/json" },
                data: { token: getToken(), id },
            }
        );
        return response.data;
    }
);

// Davet edilen kullanıcı tarafından etkinlikten ayrılma asenkron thunk
export const fetchDeleteByInvitee = createAsyncThunk(
    "event/fetchDeleteByInvitee",
    async (id: number) => {
        const response = await axios.delete(
            `${RestApis.calendar_and_planning_service_event}/delete-event-by-invitee`,
            {
                headers: { "Content-Type": "application/json" },
                data: { token: getToken(), id },
            }
        );
        return response.data;
    }
);

// Daveti kabul etme asenkron thunk
export const fetchAcceptInvite = createAsyncThunk(
    "event/fetchAcceptInvite",
    async (id: number) => {
        const token = getToken();
        console.log("Gönderilen token:", token);
        console.log("Gönderilen eventId:", id);

        try {
            const response = await axios.post(
                `${RestApis.calendar_and_planning_service_event}/accept-invite`,
                {
                    id,
                    token,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("API'den gelen yanıt:", response.data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError; // Hata türünü belirtin
            console.error("Daveti kabul etme işlemi başarısız:", axiosError.message); // Hata mesajını logla
            throw axiosError; // Hatanın dışarı atılmasını sağla
        }
    }
);

// ID ile etkinlikleri getirme asenkron thunk
export const fetchGetEventById = createAsyncThunk(
    "event/fetchGetEventById",
    async () => {
        const response = await axios.get(
            `${RestApis.calendar_and_planning_service_event}/find-all-by-auth-id`,
            {
                headers: { "Content-Type": "application/json" },
                params: { token: getToken() },
            }
        );
        return response.data;
    }
);

// Etkinlik dilimini oluştur
const eventSlice = createSlice({
    name: "event",
    initialState: initialEventState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExtractAuthId.fulfilled, (state, action: PayloadAction<IResponse>) => {
                if (action.payload.code === 200) {
                    state.authId = action.payload.data;
                    console.log("Auth ID başarıyla alındı:", state.authId);
                }
            })
            .addCase(fetchGetEventById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchGetEventById.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                if (action.payload.code === 200) {
                    state.eventList = action.payload.data;
                    console.log("Etkinlikler başarıyla alındı:", action.payload.data);
                }
            })
            .addCase(fetchGetEventById.rejected, (state, action) => {
                state.isLoading = false;
                console.error("Etkinlikleri alma işlemi başarısız:", action.error.message);
            })
            .addCase(fetchSaveEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSaveEvent.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                if (action.payload.code === 200) {
                    state.eventList.push(action.payload.data);
                    console.log("Etkinlik başarıyla kaydedildi:", action.payload.data);
                }
            })
            .addCase(fetchSaveEvent.rejected, (state, action) => {
                state.isLoading = false;
                console.error("Etkinlik kaydedilemedi:", action.error.message);
            })
            .addCase(fetchUpdateEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUpdateEvent.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                if (action.payload.code === 200) {
                    const updatedEvent = action.payload.data;
                    state.eventList = state.eventList.map(event =>
                        event.id === updatedEvent.id ? updatedEvent : event
                    );
                    console.log("Etkinlik başarıyla güncellendi:", updatedEvent);
                }
            })
            .addCase(fetchUpdateEvent.rejected, (state, action) => {
                state.isLoading = false;
                console.error("Etkinlik güncellenemedi:", action.error.message);
            })
            .addCase(fetchDeleteEventByCreator.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDeleteEventByCreator.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                if (action.payload.code === 200) {
                    const deletedEventId = action.payload.data.id;
                    state.eventList = state.eventList.filter(event => event.id !== deletedEventId);
                    console.log("Etkinlik başarıyla silindi:", deletedEventId);
                }
            })
            .addCase(fetchDeleteEventByCreator.rejected, (state, action) => {
                state.isLoading = false;
                console.error("Etkinlik silinemedi:", action.error.message);
            })
            // Davet edilen kullanıcının etkinlikten ayrılmasını işleme
            .addCase(fetchDeleteByInvitee.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDeleteByInvitee.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                if (action.payload.code === 200) {
                    const deletedEventId = action.payload.data.id;
                    state.eventList = state.eventList.filter(event => event.id !== deletedEventId);
                    console.log("Davetli kullanıcı etkinlikten başarıyla ayrıldı:", deletedEventId);
                }
            })
            .addCase(fetchDeleteByInvitee.rejected, (state, action) => {
                state.isLoading = false;
                console.error("Davetli kullanıcının etkinlikten ayrılması başarısız:", action.error.message);
            })
            // Daveti kabul etme işlemi
            .addCase(fetchAcceptInvite.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAcceptInvite.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                if (action.payload.code === 200) {
                    console.log("Davet başarıyla kabul edildi:", action.payload.data);
                } else {
                    console.error("Davet kabul edilemedi, sunucudan gelen yanıt:", action.payload);
                }
            })
            .addCase(fetchAcceptInvite.rejected, (state, action) => {
                state.isLoading = false;
                if (axios.isAxiosError(action.error)) {
                    console.error("Davet kabul edilemedi:", action.error.message);
                    console.error("Hata adı:", action.error.name);
                } else {
                    console.error("Bilinmeyen hata:", action.error);
                }
            });


    },
});


export default eventSlice.reducer;
