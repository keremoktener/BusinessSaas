export interface IDeclaration{
    id: number;
    startDate: Date;
    endDate: Date;
    totalIncome: number;
    totalExpense: number;
    netIncome: number;
    totalTax: number;
    taxType: string;
}