import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../model/IResponse";
import RestApis from "../../config/RestApis";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { SignalWifiStatusbarNullRounded } from "@mui/icons-material";

export interface IMessage {
    id: number;
    conversationId: string | null;
    senderId: number;
    receiverId: number;
    messageContent: string;
    timestamp: string;
    status: boolean;
}

export interface IConversation {
    conversationId: string;
    userId: number;
    messages: IMessage[];
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface IFaq {
    id?: number;
    question?: string;
    answer?: string;
  }

interface ILiveSupportState {
    messageList:  IMessage[]
    conversationList: IConversation[]
    faqList: IFaq[]
}

const initialLiveSupportState: ILiveSupportState = {
    messageList: [],
    conversationList: [],
    faqList: [],
};



export const fetchFindAllMessages = createAsyncThunk(
    'messages/fetchFindAllMessages',
    async (conversationId:string | null) => {
        const result = await axios.post(
            `${RestApis.live_support_service_message}/find-all?conversationId=${conversationId}`,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                }
            }
        );
        return result.data;
    }
);

export const fetchFindAllConversation = createAsyncThunk(
    'messages/fetchFindAllConversation',
    async () => {
        const result = await axios.post(
            RestApis.live_support_service_message+"/find-all-conversation",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                }
            }
        );
        return result.data;
    }
);

export const fatchSaveFaq = createAsyncThunk(
    'faq/fatchSaveFaq',
    async (payload: IFaq) => {
        const values = { question: payload.question, answer: payload.answer };
        const result = await axios.post(
            RestApis.live_support_service_faq+"/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                }
            }
        );
        return result.data;
    }
);

export const fatchUpdateFaq = createAsyncThunk(
    'faq/fatchUpdateFaq',
    async (payload: IFaq) => {
        const values = { question: payload.question, answer: payload.answer, id: payload.id };
        const result = await axios.post(
            RestApis.live_support_service_faq+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                }
            }
        );
        return result.data;
    }
);

export const fetchFindAllFaq = createAsyncThunk(
    'faq/fetchFindAllFaq',
    async () => {
        const result = await axios.post(
            `${RestApis.live_support_service_faq}/find-all`,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    
                }
            }
        );
        return result.data;
    }
);

export const fetchDeleteFaq = createAsyncThunk(
    'faq/fetchDeleteFaq',
    async (faqId: number) => {
        const result = await axios.post(
            `${RestApis.live_support_service_faq}/delete?id=${faqId}`,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                }
            }
        );
        return result.data;
    }
);


const liveSupportSlice = createSlice({
    name: 'liveSupport',
    initialState: initialLiveSupportState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchFindAllMessages.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.messageList = action.payload.data;
        });
        builder.addCase(fetchFindAllConversation.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.conversationList = action.payload.data;
        });
        builder.addCase(fetchFindAllFaq.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.faqList = action.payload.data;
        });
    }
});

export default liveSupportSlice.reducer;