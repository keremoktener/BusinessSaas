import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../model/IResponse";
import RestApis from "../../config/RestApis";
import { IPlan } from "../../model/IPlan";
import { ISubscriptionHistory } from "../../model/ISubscriptionHistory";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { IPlanTranslation } from "../../model/IPlanTranslation";

/**
 * Interface representing the subscription state.
 * @interface
 */
interface ISubscriptionState {
    planList: IPlan[]; // List of all available plans.
    activeSubscriptionRoles: string[]; // Roles for the active subscriptions.
    subscriptionHistory: ISubscriptionHistory[]; // Subscription history.
    activeSubscriptionPlans: IPlan[];
}

/**
 * Initial state for subscription slice.
 */
const initialSubscriptionState: ISubscriptionState = {
    planList: [],
    activeSubscriptionRoles: [],
    subscriptionHistory: [],
    activeSubscriptionPlans: [],
};

/**
 * Thunk to fetch all subscription plans from the server.
 * Sends an HTTP POST request to the subscription service to retrieve all plans.
 * 
 * @returns {Promise<IResponse>} The result data containing the plan list.
 */
export const fetchFindAllPlans = createAsyncThunk(
    'subscription/IFetchFindAllPlans',
    async () => {
        const result = await axios.post(
            RestApis.subscription_service_plan + "/find-all",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }
        );
        return result.data;
    }
);

/**
 * Interface representing the payload for subscribing to a plan.
 * @interface
 */
interface IFetchSubscribe {
    planId: number; // ID of the plan to subscribe to.
    subscriptionType: string; // Type of the subscription.
}

/**
 * Thunk to subscribe to a plan.
 * Sends an HTTP POST request to the subscription service to subscribe to a specific plan.
 * 
 * @param {IFetchSubscribe} payload The subscription details including planId and subscriptionType.
 * @returns {Promise<IResponse>} The result data containing subscription details.
 */
export const fetchSubscribe = createAsyncThunk(
    'subscription/fetchSubscribe',
    async (payload: IFetchSubscribe) => {
        const values = { planId: payload.planId, subscriptionType: payload.subscriptionType };
        const result = await axios.post(
            RestApis.subscription_service_subscription + "/subscribe",
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

/**
 * Thunk to unsubscribe from a plan.
 * Sends an HTTP POST request to the subscription service to unsubscribe from a specific plan.
 * 
 * @param {number} planId The ID of the plan to unsubscribe from.
 * @returns {Promise<IResponse>} The result data containing unsubscription details.
 */
export const fetchUnsubscribe = createAsyncThunk(
    'subscription/fetchUnsubscribe',
    async (planId: number) => {
        const result = await axios.post(
            `${RestApis.subscription_service_subscription}/unsubscribe?planId=${planId}`,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }
        );
        return result.data;
    }
);

/**
 * Thunk to check active subscriptions.
 * Sends an HTTP POST request to check which subscriptions are currently active.
 * 
 * @returns {Promise<IResponse>} The result data containing the list of active subscription roles.
 */
export const fetchCheckSubscription = createAsyncThunk(
    'subscription/fetchCheckSubscription',
    async () => {
        const values = {};
        const result = await axios.post(
            RestApis.subscription_service_subscription + "/check-subscriptions",
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

/**
 * Thunk to fetch subscription history.
 * Sends an HTTP POST request to the subscription service to retrieve subscription history.
 * 
 * @returns {Promise<IResponse>} The result data containing the subscription history.
 */
export const fetchSubscriptionHistory = createAsyncThunk(
    'subscription/fetchSubscriptionHistory',
    async (language:string) => {
        const result = await axios.post(
            `${RestApis.subscription_service_subscription}/subscription-history?language=${encodeURIComponent(language)}`,
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
)
interface IFetchUpdatePlan {
    id: number,
    price: number;
    roles: string[];
    planTranslations: IPlanTranslation[];
}
export const fetchUpdatePlan = createAsyncThunk(
    'subscription/IFetchUpdatePlan',
    async (payload : IFetchUpdatePlan) => {
        const values = {id: payload.id, price: payload.price, roles: payload.roles, translations: payload.planTranslations};
        const result = await axios.post(
            RestApis.subscription_service_plan + "/update",
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
)
interface IFetchAddPlan {
    price: number;
    roles: string[];
    planTranslations: IPlanTranslation[];
}
export const fetchAddPlan = createAsyncThunk(
    'subscription/fetchAddPlan',
    async (payload: IFetchAddPlan) => {
        const values = {price: payload.price, roles: payload.roles, translations: payload.planTranslations};
        const result = await axios.post(
            RestApis.subscription_service_plan + "/save",
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
)

export const fetchFindAllActiveSubscriptionPlans = createAsyncThunk(
    'subscription/fetchFindAllActiveSubscriptionPlans',
    async () => {
        const result = await axios.post(
            RestApis.subscription_service_subscription + "/find-all-active-subscription-plans",
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
)


const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: initialSubscriptionState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchFindAllPlans.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.planList = action.payload.data;
        });
        builder.addCase(fetchCheckSubscription.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.activeSubscriptionRoles = action.payload.data;
        });
        builder.addCase(fetchSubscriptionHistory.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.subscriptionHistory = action.payload.data;
        })
        builder.addCase(fetchFindAllActiveSubscriptionPlans.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.activeSubscriptionPlans = action.payload.data;
        })
    }
});

export default subscriptionSlice.reducer;
