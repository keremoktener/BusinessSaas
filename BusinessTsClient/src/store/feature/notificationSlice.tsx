import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import RestApis from '../../config/RestApis';

interface Notification {
    id: number;
    authId: string; // authId yerine userId olmayacak
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    isDeleted: boolean;
}

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: NotificationsState = {
    notifications: [],
    unreadCount: 0,
    status: 'idle',
};

// Fetch unread notification count
export const fetchUnreadNotificationCount = createAsyncThunk(
    'notifications/fetchUnreadNotificationCount',
    async () => {
        try {
            const token = localStorage.getItem('token'); // authId'yi localStorage'dan al
            const response = await fetch(`${RestApis.notification_service}/getunreadcount?token=${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // authId'yi header'da gönder
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response from server:', errorData);
                throw new Error(`Network response was not ok: ${errorData}`);
            }

            const data = await response.json();
            return data as number;
        } catch (error) {
            console.error('Failed to fetch unread notification count:', error);
            throw error;
        }
    }
);

export const fetchGetAllNotifications = createAsyncThunk(
    'notifications/fetchGetAllNotifications',
    async () => {
        try {
            const token = localStorage.getItem('token'); // authId'yi localStorage'dan al
            const response = await fetch(`${RestApis.notification_service}/getallnotifications?token=${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response from server:', errorData);
                throw new Error(`Network response was not ok: ${errorData}`);
            }

            const data = await response.json();
            return data as Notification[];
        } catch (error) {
            console.error('Failed to fetch notifications:', error);

            throw error;
        }
    }
);
// Fetch all unread notifications
export const fetchGetAllUnreadNotifications = createAsyncThunk(
    'notifications/fetchGetAllUnreadNotifications',
    async () => {
        try {
            const token = localStorage.getItem('token'); // authId'yi localStorage'dan al

            const response = await fetch(`${RestApis.notification_service}/getallunreadnotifications?token=${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // authId'yi header'da gönder
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response from server:', errorData);
                throw new Error(`Network response was not ok: ${errorData}`);
            }

            const data = await response.json();
            return data as Notification[];
        } catch (error) {
            console.error('Failed to fetch unread notifications:', error);
            throw error;
        }
    }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markNotificationAsRead',
    async (id: number, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found.');
            }

            const response = await fetch(
                `${RestApis.notification_service}/read?token=${token}&notificationId=${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to mark notification as read: ${errorData}`);
            }

            return id;
        } catch (error) {
            console.error('Failed to mark notification as read:', error);

            // Hatanın tipi 'unknown' olduğu için tür dönüşümü yapıyoruz
            if (error instanceof Error) {
                return rejectWithValue(error.message);  // 'Error' türündeki hata mesajı
            } else {
                return rejectWithValue(String(error));  // Bilinmeyen hata türleri için string'e çevir
            }
        }
    }
);



// Delete notifications
export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotifications',
    async (notificationIds: number[]) => {
        try {
            const token = localStorage.getItem('token'); // authId'yi localStorage'dan al


                const response = await fetch(`${RestApis.notification_service}/delete?token=${token}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // authId'yi header'da gönder
                },
                body: JSON.stringify(notificationIds),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Network response was not ok: ${errorData}`);
            }
            return notificationIds;
        } catch (error) {
            console.error('Failed to delete notifications:', error);
            throw error;
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all notifications
            .addCase(fetchGetAllNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGetAllNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.status = 'idle';
                state.notifications = action.payload;
            })
            .addCase(fetchGetAllNotifications.rejected, (state) => {
                state.status = 'failed';
            })

            // Fetch unread notifications
            .addCase(fetchGetAllUnreadNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.status = 'idle';
                state.notifications = action.payload;
            })

            // Fetch unread notification count
            .addCase(fetchUnreadNotificationCount.fulfilled, (state, action: PayloadAction<number>) => {
                state.unreadCount = action.payload; // Update the unread count in the state
            })

            // Mark notification as read
            .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<number>) => {
                const notification = state.notifications.find((n) => n.id === action.payload);
                if (notification) {
                    notification.isRead = true;
                }
            })

            // Delete notifications
            .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<number[]>) => {
                const idsToDelete = new Set(action.payload);
                state.notifications = state.notifications.filter((n) => !idsToDelete.has(n.id));
            });
    },
});

export default notificationSlice.reducer;
