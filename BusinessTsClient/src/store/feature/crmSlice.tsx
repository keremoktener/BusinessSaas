import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {ICrmCustomer} from "../../model/ICrmCustomer";
import {ICrmMarketingCampaign} from "../../model/ICrmMarketingCampaign.tsx";
import {ICrmOpportunity} from "../../model/ICrmOpportunity.tsx";
import {ICrmActivity} from "../../model/ICrmActivity.tsx";
import {ICrmTicket} from "../../model/ICrmTicket.tsx";
import {IResponse} from "../../model/IResponse";
import {ICrmOpportunityDetail} from "../../model/ICrmOpportunityDetail";
import {ICrmTicketDetail} from "../../model/ICrmTicketDetail.tsx";


interface ICrmState {
    customerList: ICrmCustomer[]
    marketingCampaignList: ICrmMarketingCampaign[]
    opportunityList: ICrmOpportunity[]
    activitiesList: ICrmActivity[]
    ticketList: ICrmTicket[]
    opportunityDetail: ICrmOpportunityDetail[]
    ticketDetail: ICrmTicketDetail[]
}

const initialCrmState: ICrmState = {
    customerList: [],
    marketingCampaignList: [],
    opportunityList: [],
    activitiesList: [],
    ticketList: [],
    opportunityDetail: [],
    ticketDetail: []
}

interface IfetchSaveCustomer {

    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

//# region Customer Operations
export const fetchSaveCustomer = createAsyncThunk(
    'crm/fetchSaveCustomer',
    async (payload: IfetchSaveCustomer) => {
        const values = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            address: payload.address
        };

        const result = await axios.post(
            RestApis.crm_service_customer + "/save",
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

export const fetchDeleteCustomer = createAsyncThunk(
    'crm/fetchDeleteCustomer',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.crm_service_customer + "/delete?id=" + id,
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

interface IfetchUpdateCustomer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

export const fetchUpdateCustomer = createAsyncThunk(
    'crm/fetchUpdateCustomer',
    async (payload: IfetchUpdateCustomer) => {
        const values = {
            id: payload.id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            address: payload.address
        };

        const result = await axios.put(
            RestApis.crm_service_customer + "/update",
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
)

interface IfetchFindAllCustomer {
    page: number;
    size: number;
    searchText: string
}

export const fetchFindAllCustomer = createAsyncThunk(
    'crm/fetchCustomerList',
    async (payload: IfetchFindAllCustomer) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_customer + "/find-all",
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
export const fetchFindAllCustomerForOpportunity = createAsyncThunk(
    'crm/fetchCustomerListForOpportunity',
    async (payload: IfetchFindAllCustomer) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_customer + "/for-opportunity",
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

export const fetchFindCustomerById = createAsyncThunk(
    'crm/fetchCustomerById',
    async (id: number) => {
        const result = await axios.post(
            RestApis.crm_service_customer + "/find-by-id?id=" + id, null,
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
interface IFetchUploadExcelCustomer {
    address: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;

}
export const fetchUploadExcelCustomer = createAsyncThunk(
    'crm/fetchUploadExcelCustomer',
    async (payload: IFetchUploadExcelCustomer[]) => {
        const result = await axios.post(
            RestApis.crm_service_customer + "/upload-excel-customer",
            { customers: payload },
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
interface IFetchSendingEmailExternalSourceCustomer {
    email: string;
}
export const fetchSendingEmailExternalSourceCustomer = createAsyncThunk(
    'crm/fetchSendingEmailExternalSourceCustomer',
    async (payload: IFetchSendingEmailExternalSourceCustomer) => {
        const result = await axios.post(
            RestApis.crm_service_customer + "/send-email-external-source-customer",
            { email: payload.email },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    });
interface IFetchSaveExternalCustomer {
    firstName : string;
    lastName : string;
    email : string;
    phone : string;
    address : string;
}
export const fetchSaveExternalCustomer = createAsyncThunk(
    'crm/fetchSaveExternalCustomer',
    async (payload: IFetchSaveExternalCustomer) => {
        const values = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            address: payload.address
        };

        const result = await axios.post(
            RestApis.crm_service_customer + "/save-external-source-customer",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    });

//# endregion Customer Operations

// # region Marketing Campaign Operations
interface IFetchSaveMarketingCampaign {

    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    budget: number;

}

export const fetchSaveMarketingCampaign = createAsyncThunk(
    'crm/fetchSaveMarketingCampaign',
    async (payload: IFetchSaveMarketingCampaign) => {
        const values = {
            name: payload.name,
            description: payload.description,
            startDate: payload.startDate,
            endDate: payload.endDate,
            budget: payload.budget,

        };

        const result = await axios.post(
            RestApis.crm_service_marketing_campaign + "/save",
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

export const fetchDeleteMarketingCampaign = createAsyncThunk(
    'crm/fetchDeleteMarketingCampaign',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.crm_service_marketing_campaign + "/delete?id=" + id,
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

interface IFetchUpdateMarketingCampaign {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    budget: number;
}

export const fetchUpdateMarketingCampaign = createAsyncThunk(
    'crm/fetchUpdateMarketingCampaign',
    async (payload: IFetchUpdateMarketingCampaign) => {
        const values = {
            id: payload.id,
            name: payload.name,
            description: payload.description,
            startDate: payload.startDate,
            endDate: payload.endDate,
            budget: payload.budget,
        };

        const result = await axios.put(
            RestApis.crm_service_marketing_campaign + "/update",
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

interface IFetchFindAllMarketingCampaign {
    page: number;
    size: number;
    searchText: string
}

export const fetchFindAllMarketingCampaign = createAsyncThunk(
    'crm/fetchMarketingCampaignList',
    async (payload: IFetchFindAllMarketingCampaign) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_marketing_campaign + "/find-all",
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
export const fetchFindMarketingCampaignById = createAsyncThunk(
    'crm/fetchMarketingCampaignById',
    async (id: number) => {
        const result = await axios.post(
            RestApis.crm_service_marketing_campaign + "/find-by-id?id=" + id, null,
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

//# endregion Marketing Campaign Operations
//# region Opportunity Operations

interface IFetchSaveOpportunity {
    name: string;
    description: string;
    value: number;
    stage: string;
    probability: bigint;
}

export const fetchSaveOpportunity = createAsyncThunk(
    'crm/fetchSaveOpportunity',
    async (payload: IFetchSaveOpportunity) => {
        const values = {
            name: payload.name,
            description: payload.description,
            value: payload.value,
            stage: payload.stage,
            probability: payload.probability,
       
        };

        const result = await axios.post(
            RestApis.crm_service_opportunity + "/save",
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
interface IFetchCustomerOpportunity {
    id: number
    customers: number[]
}
export const fetchSaveCustomerOpportunity = createAsyncThunk(
    'crm/fetchSaveCustomerOpportunity',
    async (payload: IFetchCustomerOpportunity) => {
        const values = {
            id: payload.id,
            customers: payload.customers
        }

        const result = await axios.put(
            RestApis.crm_service_opportunity + "/save-customer",
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


export const fetchDeleteOpportunity = createAsyncThunk(
    'crm/fetchDeleteOpportunity',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.crm_service_opportunity + "/delete?id=" + id,
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
interface IFetchUpdateOpportunity {
    id: number;
    name: string;
    description: string;
    value: number;
    stage: string;
    probability: bigint;
    customers: number[] // y
    customersToRemove: number[]; //y

}
export const fetchUpdateOpportunity = createAsyncThunk(
    'crm/fetchUpdateOpportunity',
    async (payload: IFetchUpdateOpportunity) => {
        const values = {
            id: payload.id,
            name: payload.name,
            description: payload.description,
            value: payload.value,
            stage: payload.stage,
            probability: payload.probability,
            customers: payload.customers, //y
            customersToRemove: payload.customersToRemove //
            
        };

        const result = await axios.put(
            RestApis.crm_service_opportunity + "/update",
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

interface IFetchFindAllOpportunity {
    page: number;
    size: number;
    searchText: string
}

export const fetchFindAllOpportunity = createAsyncThunk(
    'crm/fetchOpportunityList',
    async (payload: IFetchFindAllOpportunity) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_opportunity + "/find-all",
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
)

export const fetchFindOpportunityById = createAsyncThunk(
    'crm/fetchOpportunityById',
    async (id: number) => {
        const result = await axios.post(
            RestApis.crm_service_opportunity + "/find-by-id?id=" + id, null,
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
export const fetchGetDetailsOpportunity = createAsyncThunk(
    'crm/fetchGetDetailsOpportunity',
    async (id: number) => {
        const result = await axios.post(
            RestApis.crm_service_opportunity + "/get-details?id=" + id, null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

//# endregion Opportunity Operations
//# SalesActivity Operations




interface IFetchFindAllActivities {
    page: number;
    size: number;
    searchText: string;

}

export const fetchFindAllActivities = createAsyncThunk(
    'crm/fetchActivityList',
    async (payload: IFetchFindAllActivities) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_activities + "/find-all",
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
export const fetchFindSalesActivityById = createAsyncThunk(
    'crm/fetchSalesActivityById',
    async (id: number) => {
        const result = await axios.post(
            RestApis.crm_service_activities + "/find-by-id?id=" + id, null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)
//# endregion SalesActivity Operations
//# Ticket Operations
interface IFetchSaveTicket {
    subject: string;
    description: string;
    ticketStatus: string;
    priority: string;
    createdDate: Date;
    closedDate: Date;
}

export const fetchSaveTicket = createAsyncThunk(
    'crm/fetchTicketList',
    async (payload: IFetchSaveTicket) => {
        const values = {
            subject: payload.subject,
            description: payload.description,
            ticketStatus: payload.ticketStatus,
            priority: payload.priority,
            createdDate: payload.createdDate,
            closedDate: payload.closedDate

        };
        const result = await axios.post(
            RestApis.crm_service_ticket + "/save",
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
interface IFetchCustomerTicket {
    id: number
    customers: number[]
}
export const fetchSaveCustomerTicket = createAsyncThunk(
    'crm/fetchSaveCustomerTicket',
    async (payload: IFetchCustomerTicket) => {
        const values = {
            id: payload.id,
            customers: payload.customers
        }

        const result = await axios.put(
            RestApis.crm_service_ticket + "/save-customer",
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

interface IFetchUpdateTicket {
    id: number;
    subject: string;
    description: string;
    ticketStatus: string;
    priority: string;
    createdDate: Date;
    closedDate: Date;
}

export const fetchUpdateTicket = createAsyncThunk(
    'crm/fetchUpdateTicket',
    async (payload: IFetchUpdateTicket) => {
        const values = {
            id: payload.id,
            subject: payload.subject,
            description: payload.description,
            ticketStatus: payload.ticketStatus,
            priority: payload.priority,
            createdDate: payload.createdDate,
            closedDate: payload.closedDate
        };

        const result = await axios.put(
            RestApis.crm_service_ticket + "/update",
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

export const fetchDeleteTicket = createAsyncThunk(
    'crm/fetchDeleteTicket',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.crm_service_ticket + "/delete?id=" + id,
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

interface IFetchFindAllTicket {
    page: number;
    size: number;
    searchText: string
}

export const fetchFindAllTicket = createAsyncThunk(
    'crm/fetchTicketList',
    async (payload: IFetchFindAllTicket) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_ticket + "/find-all",
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
export const fetchFindTicketById = createAsyncThunk(
    'crm/fetchTicketById',
    async (id: number) => {
        const result = await axios.post(
            RestApis.crm_service_ticket + "/find-by-id?id=" + id, null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)
export const fetchGetDetailsTicket = createAsyncThunk(
    'crm/fetchGetDetailsTicket',
    async (id: number) => {
        const result = await axios.post(
            RestApis.crm_service_ticket + "/get-details?id=" + id, null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

//# endregion Ticket Operations


const crmSlice = createSlice({
    name: 'crm',
    initialState: initialCrmState,
    reducers: {
        closeModal: () => {

        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFindAllCustomer.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.customerList = action.payload.data;
        })
        builder.addCase(fetchFindAllCustomerForOpportunity.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.customerList = action.payload.data;
        })
        builder.addCase(fetchFindAllMarketingCampaign.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.marketingCampaignList = action.payload.data;
        })
        builder.addCase(fetchFindAllOpportunity.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.opportunityList = action.payload.data;
        })
        builder.addCase(fetchFindAllActivities.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.activitiesList = action.payload.data;
        })
        builder.addCase(fetchFindAllTicket.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.ticketList = action.payload.data;
        })
    }
});

export default crmSlice.reducer;

export const {} = crmSlice.actions;

