import {IDepartment} from "./IDepartment.tsx";

export interface IBudget{
    id: number;
    totalAmount: number;
    subAmount: number;
    spentAmount: number;
    budgetCategory: string;
    description: string;
    departmentName: string;
}