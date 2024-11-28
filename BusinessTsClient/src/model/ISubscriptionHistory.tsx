export interface ISubscriptionHistory {
    authId: number,
    subscriptionType: string,
    status: string,
    startDate: Date,
    endDate: Date,
    updatedAt: Date,
    planName: string,
    planPrice: number
    planDescription: string
}