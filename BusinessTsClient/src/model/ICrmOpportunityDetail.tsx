export interface ICrmOpportunityDetail {
    id: number;
    memberId: number;
    customers: number[];
    name: string;
    description: string;
    value: number;
    stage: string;
    probability: bigint;
    status:string
    firstName: string;
    lastName: string;

}