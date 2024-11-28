export interface ICrmActivity {
    id: string;
    memberId: number;
    opportunityId: number;
    type: string;
    date: Date;
    notes: string;
    status: string;
}