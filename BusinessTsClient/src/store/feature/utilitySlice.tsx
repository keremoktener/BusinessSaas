import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {IResponse} from "../../model/IResponse";
import {IBugReport} from "../../model/UtilityService/IBugReport.tsx";
import { IFeedbackReport } from "../../model/UtilityService/IFeedbackReport.tsx";
import { IFeedback } from "../../model/UtilityService/IFeedback.tsx";



interface IUtility {
    bugReportList: IBugReport[]
    feedbackList: IFeedback[];
    feedbackReport?: IFeedbackReport;
    userFeedbacks?: IFeedback[];

}

const initialUtilityState: IUtility = {
    bugReportList: [],
    feedbackList: [],
    userFeedbacks: []

}




//#region Department
interface IfetchSaveBugReport {
    subject: string;
    description: string;
}

export const fetchSaveBugReport = createAsyncThunk(
    'utility/fetchSaveBugReport',
    async (payload: IfetchSaveBugReport) => {
        const usersName = {
            subject: payload.subject,
            description: payload.description
        };

        const result = await axios.post(
            RestApis.utility_bug_report + "/save",
            usersName,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;

    }
);

export const fetchDeleteBugReport = createAsyncThunk(
    'utility/fetchDeleteBugReport',
    async (id: number) => {

        const result = await axios.delete(
            RestApis.utility_bug_report + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;

    }
);

export enum bugStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REJECTED = "REJECTED"

}

interface IfetchUpdateStatus {
    id: number;
    bugStatus: string;
}

export const fetchUpdateStatus = createAsyncThunk(
    'utility/fetchUpdateStatus',
    async (payload: IfetchUpdateStatus) => {
        const values = { id: payload.id, bugStatus: payload.bugStatus };
        const result = await axios.put(
            RestApis.utility_bug_report + "/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllDepartment {

    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllBugReport = createAsyncThunk(
    'utility/fetchFindAllBugReport',
    async (payload: IfetchFindAllDepartment) => {
        const values = {searchText: payload.searchText, page: payload.page, size: payload.size};

        const result = await axios.post(
            RestApis.utility_bug_report + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;

    }
);

export const fetchFindByIdBugReport = createAsyncThunk(
    'utility/fetchFindByIdBugReport',
    async (id: number) => {


        const result = await axios.post(
            RestApis.utility_bug_report + "/find-by-id?id=" + id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;

    }
);

interface IfetchBugReportFeedback {

    id:number,
    feedback: string
}

export const fetchBugReportFeedback = createAsyncThunk(
    'utility/fetchBugReportFeedback',
    async (payload: IfetchBugReportFeedback) => {
        const values = {id: payload.id, feedback: payload.feedback};

        const result = await axios.put(
            RestApis.utility_bug_report + "/feedback",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;

    }
);

export const fetchReopenBugCase = createAsyncThunk(
    'utility/fetchReopenBugCase',
    async (id: number) => {


        const result = await axios.post(
            RestApis.utility_bug_report + "/reopen-case?id=" + id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;

    }
);


export const fetchSaveFeedback = createAsyncThunk(
    "utility/fetchSaveFeedback",
    async (feedbackData: {  description: string; rating: number }) => {
        const result = await axios.post(
            `${RestApis.utility_feedback}/save`,
            feedbackData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return result.data;
    }
);

export const fetchUpdateFeedback = createAsyncThunk(
    "utility/fetchUpdateFeedback",
    async (feedbackData: { description?: string; rating?: number }) => {
        const result = await axios.post(
            `${RestApis.utility_feedback}/update`,
            feedbackData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return result.data;
    }
);


export const fetchDeleteFeedback = createAsyncThunk(
    "utility/fetchDeleteFeedback",
    async () => {
        const result = await axios.delete(
            `${RestApis.utility_feedback}/delete`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return result.data;
    }
);

export const fetchUserFeedback = createAsyncThunk(
    "utility/fetchUserFeedback",
    async () => {
        const result = await axios.get(
            `${RestApis.utility_feedback}/get-user-feedback`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return result.data;
    }
);


export const fetchAllFeedbacks = createAsyncThunk(
    "utility/fetchAllFeedbacks",
    async (payload:IfetchFindAllDepartment) => {
        const values = {searchText: payload.searchText, page: payload.page, size: payload.size};
        const result = await axios.post( `${RestApis.utility_feedback}/find-all`
            ,values,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return result.data;
    }
);


export const fetchFeedbackReport = createAsyncThunk(
    "utility/fetchFeedbackReport",
    async () => {
        const result = await axios.get(
            `${RestApis.utility_feedback}/report`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return result.data;
    }
);
//#endregion

const utilitySlice = createSlice({
    name: 'utility',
    initialState: initialUtilityState,
    reducers: {
        closeModal: () => {

        },
    },
    extraReducers: (build) => {
        build
        .addCase(fetchSaveFeedback.fulfilled, (state, action: PayloadAction<IFeedback>) => {
            state.feedbackList.push(action.payload);
        })
        .addCase(fetchAllFeedbacks.fulfilled, (state, action: PayloadAction<IFeedback[]>) => {
            state.feedbackList = action.payload;
        })
        .addCase(fetchUserFeedback.fulfilled, (state, action: PayloadAction<IFeedback[]>) => {
            state.userFeedbacks = action.payload; 
        });
    }

});

export default utilitySlice.reducer;
export const {} = utilitySlice.actions