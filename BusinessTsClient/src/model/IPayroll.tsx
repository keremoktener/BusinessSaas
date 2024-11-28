export interface IPayroll{
    id: number;
    employeeId: number;
    firstName: string;
    lastName: string;
    salaryDate: Date;
    grossSalary: number;
    deductions: number;
    netSalary: number;
    status: string;
}