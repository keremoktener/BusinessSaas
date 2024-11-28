export interface IBenefit{
    id: number;
    employeeId: number;
    firstName: string;
    lastName: string;
    type: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    status: string;
}