export interface IFinancialReport{
    id: number;
    financialReportType: string;
    startDate: Date;
    endDate: Date;
    totalIncome: number;
    totalOutcome: number;
    totalTax: number;
    totalProfit: number;
    message: string;
}