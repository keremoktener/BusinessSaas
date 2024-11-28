import {IBudget} from "../../model/IBudget.tsx";
import {IDeclaration} from "../../model/IDeclaration.tsx";
import {IExpense} from "../../model/IExpense.tsx";
import {IFinancialReport} from "../../model/IFinancialReport.tsx";
import {IIncome} from "../../model/IIncome.tsx";
import {IInvoice} from "../../model/IInvoice.tsx";
import {ITax} from "../../model/ITax.tsx";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import RestApis from "../../config/RestApis.tsx";
import {IResponse} from "../../model/IResponse.tsx";

interface IFinanceState {
    budgetList: IBudget[];
    declarationList: IDeclaration[];
    expenseList: IExpense[];
    financialReportList: IFinancialReport[];
    incomeList: IIncome[];
    invoiceList: IInvoice[];
    taxList: ITax[];
}

const initialFinanceState: IFinanceState = {
    budgetList: [],
    declarationList: [],
    expenseList: [],
    financialReportList: [],
    incomeList: [],
    invoiceList: [],
    taxList: [],
};


//#region Budget
interface IFetchSaveBudget {
    departmentId: number;
    subAmount: number;
    budgetCategory: string;
    description: string;
}


export const fetchSaveBudget = createAsyncThunk(
    'finance/fetchSaveBudget',
    async (payload: IFetchSaveBudget) => {
        const budget = {
            departmentId: payload.departmentId,
            subAmount: payload.subAmount,
            budgetCategory: payload.budgetCategory,
            description: payload.description
        };
        const result = await axios.post(
            RestApis.finance_service_budget + "/save",
            budget,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)


export const fetchDeleteBudget = createAsyncThunk(
    'finance/fetchDeleteBudget',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.finance_service_budget + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

interface IUpdateBudget {
    id: number;
    departmentId: number;
    subAmount: number;
    budgetCategory: string;
    description: string;
}

export const fetchUpdateBudget = createAsyncThunk(
    'finance/fetchUpdateBudget',
    async (payload: IUpdateBudget) => {
        const budget = {
            id: payload.id,
            departmentId: payload.departmentId,
            subAmount: payload.subAmount,
            budgetCategory: payload.budgetCategory,
            description: payload.description
        };
        const result = await axios.put(
            RestApis.finance_service_budget + "/update",
            budget,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

interface IfetchFindAllBudget {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllBudget = createAsyncThunk(
    'finance/fetchFindAllBudget',
    async (payload: IfetchFindAllBudget) => {
        const values = {
            searchText: payload.searchText,
            page: payload.page,
            size: payload.size
        };
        const result = await axios.post(
            RestApis.finance_service_budget + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdBudget = createAsyncThunk(
    'finance/fetchFindByIdBudget',
    async (id: number) => {
        const result = await axios.post(
            RestApis.finance_service_budget + "/find-by-id?id=" + id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchGetBudgetCategories = createAsyncThunk(
    'finance/fetchGetBudgetCategories',
    async () => {
        const result = await axios.post(
            RestApis.finance_service_budget + "/get-all-categories",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchGetBudgetByDepartmentName = createAsyncThunk(
    'finance/fetchGetBudgetByDepartmentName',
    async (departmentName: string) => {
        const result = await axios.post(
            RestApis.finance_service_budget + "/find-all-by-department-name?departmentName=" + departmentName,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
//#endregion Budget


//#region Declaration

interface IFetchDeclaration {
    taxType: string;
    totalIncome: number;
    totalExpense: number;
    startDate: Date;
    endDate: Date;
}

export const fetchCreateDeclaration = createAsyncThunk(
    'finance/fetchCreateDeclaration',
    async (payload: IFetchDeclaration) => {
        const declaration = {
            taxType: payload.taxType,
            totalIncome: payload.totalIncome,
            totalExpense: payload.totalExpense,
            startDate: payload.startDate,
            endDate: payload.endDate
        };
        const result = await axios.post(
            RestApis.finance_service_declaration + "/create",
            declaration,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IFindAllDeclaration {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllDeclaration = createAsyncThunk(
    'finance/fetchFindAllDeclaration',
    async (payload: IFindAllDeclaration) => {
        const values = {
            searchText: payload.searchText,
            page: payload.page,
            size: payload.size
        };
        const result = await axios.post(
            RestApis.finance_service_declaration + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
//#endregion Declaration


//#region Expense
interface IFetchSaveExpense {
    departmentId: number;
    expenseCategory: string;
    expenseDate: Date;
    amount: number;
    description: string;
}

export const fetchSaveExpense = createAsyncThunk(
    'finance/fetchSaveExpense',
    async (payload: IFetchSaveExpense) => {
        const expense = {
            departmentId: payload.departmentId,
            expenseCategory: payload.expenseCategory,
            expenseDate: payload.expenseDate,
            amount: payload.amount,
            description: payload.description
        };
        const result = await axios.post(
            RestApis.finance_service_expense + "/save",
            expense,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

interface IFetchUpdateExpense {
    id: number;
    expenseDate: Date;
    amount: number;
    description: string;
    expenseCategory: string;
}

export const fetchUpdateExpense = createAsyncThunk(
    'finance/fetchUpdateExpense',
    async (payload: IFetchUpdateExpense) => {
        const expense = {
            id: payload.id,
            expenseDate: payload.expenseDate,
            amount: payload.amount,
            description: payload.description,
            expenseCategory: payload.expenseCategory
        };
        const result = await axios.put(
            RestApis.finance_service_expense + "/update",
            expense,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

export const fetchDeleteExpense = createAsyncThunk(
    'finance/fetchDeleteExpense',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.finance_service_expense + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

interface IfetchFindAllExpense {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllExpense = createAsyncThunk(
    'finance/fetchFindAllExpense',
    async (payload: IfetchFindAllExpense) => {
        const values = {
            searchText: payload.searchText,
            page: payload.page,
            size: payload.size
        };
        const result = await axios.post(
            RestApis.finance_service_expense + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdExpense = createAsyncThunk(
    'finance/fetchFindByIdExpense',
    async (id: number) => {
        const result = await axios.post(
            RestApis.finance_service_expense + "/find-by-id?id=" + id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IFetchFindExpenseByDate {
    startDate: Date;
    endDate: Date;
}

export const fetchFindExpenseByDate = createAsyncThunk(
    'finance/fetchFindExpenseByDate',
    async (payload: IFetchFindExpenseByDate) => {
        const values = {
            startDate: payload.startDate.toISOString().split('T')[0], // ISO format 'yyyy-mm-dd'
            endDate: payload.endDate.toISOString().split('T')[0]
        };
        const result = await axios.post(
            RestApis.finance_service_expense + "/find-by-date",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchCalculateTotalExpenseByDate = createAsyncThunk(
    'finance/fetchCalculateTotalExpenseByDate',
    async (payload: IFetchFindExpenseByDate) => {
        const values = {
            startDate: payload.startDate.toISOString().split('T')[0], // ISO format 'yyyy-mm-dd'
            endDate: payload.endDate.toISOString().split('T')[0]
        };
        const result = await axios.post(
            RestApis.finance_service_expense + "/calculate",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchGetAllExpenseCategories = createAsyncThunk(
    'finance/fetchGetAllExpenseCategories',
    async () => {
        const result = await axios.post(
            RestApis.finance_service_expense + "/get-all-categories",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchExpenseByMonths = createAsyncThunk(
    'finance/fetchExpenseByMonths',
    async (payload: IFetchFindExpenseByDate) => {
        const values = {
            startDate: payload.startDate.toISOString().split('T')[0], // ISO format 'yyyy-mm-dd'
            endDate: payload.endDate.toISOString().split('T')[0]
        };
        const result = await axios.post(
            RestApis.finance_service_expense + "/get-for-months",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
//#endregion Expense


//#region FinancialReport
interface IFetchCreateFinancialReport {
    financialReportType: string;
    startDate: Date;
    endDate: Date;
}

export const fetchCreateFinancialReport = createAsyncThunk(
    'finance/fetchCreateFinancialReport',
    async (payload: IFetchCreateFinancialReport) => {
        const financialReport = {
            financialReportType: payload.financialReportType,
            startDate: payload.startDate,
            endDate: payload.endDate
        };
        const result = await axios.post(
            RestApis.finance_service_financial_report + "/save",
            financialReport,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);

interface IFetchUpdateFinancialReport {
    id: number;
    financialReportType: string;
    startDate: Date;
    endDate: Date;
    totalIncome: number;
    totalOutcome: number;
    totalProfit: number;
}

export const fetchUpdateFinancialReport = createAsyncThunk(
    'finance/fetchUpdateFinancialReport',
    async (payload: IFetchUpdateFinancialReport) => {
        const financialReport = {
            id: payload.id,
            financialReportType: payload.financialReportType,
            startDate: payload.startDate,
            endDate: payload.endDate,
            totalIncome: payload.totalIncome,
            totalOutcome: payload.totalOutcome,
            totalProfit: payload.totalProfit
        };
        const result = await axios.put(
            RestApis.finance_service_financial_report + "/update",
            financialReport,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);

export const fetchDeleteFinancialReport = createAsyncThunk(
    'finance/fetchDeleteFinancialReport',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.finance_service_financial_report + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)

interface IfetchFindAllFinancialReport {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllFinancialReport = createAsyncThunk(
    'finance/fetchFindAllFinancialReport',
    async (payload: IfetchFindAllFinancialReport) => {
        const values = {
            searchText: payload.searchText,
            page: payload.page,
            size: payload.size
        };
        const result = await axios.post(
            RestApis.finance_service_financial_report + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdFinancialReport = createAsyncThunk(
    'finance/fetchFindByIdFinancialReport',
    async (id: number) => {
        const result = await axios.post(
            RestApis.finance_service_financial_report + "/find-by-id?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);


interface IfetchCompareFinancialReport {
    ids: number[];
}

export const fetchCompareFinancialReport = createAsyncThunk(
    'finance/fetchCompareFinancialReport',
    async (payload: IfetchCompareFinancialReport) => {
        const values = {
            ids: payload.ids
        };
        const result = await axios.post(
            RestApis.finance_service_financial_report + "/compare",
            values,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);
//#endregion FinancialReport


//#region Income
interface IFetchSaveIncome {
    source: string;
    amount: number;
    incomeDate: Date;
}

export const fetchSaveIncome = createAsyncThunk(
    'finance/fetchSaveIncome',
    async (payload: IFetchSaveIncome) => {
        const income = {
            source: payload.source,
            amount: payload.amount,
            incomeDate: payload.incomeDate
        };
        const result = await axios.post(
            RestApis.finance_service_income + "/save",
            income,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

interface IFetchUpdateIncome {
    id: number;
    source: string;
    amount: number;
    incomeDate: Date;
}

export const fetchUpdateIncome = createAsyncThunk(
    'finance/fetchUpdateIncome',
    async (payload: IFetchUpdateIncome) => {
        const income = {
            id: payload.id,
            source: payload.source,
            amount: payload.amount,
            incomeDate: payload.incomeDate
        };
        const result = await axios.put(
            RestApis.finance_service_income + "/update",
            income,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

export const fetchDeleteIncome = createAsyncThunk(
    'finance/fetchDeleteIncome',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.finance_service_income + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IFetchFindIncomeByDate {
    startDate: Date;
    endDate: Date;
}

export const fetchFindIncomeByDate = createAsyncThunk(
    'finance/fetchFindIncomeByDate',
    async (payload: IFetchFindIncomeByDate) => {
        const values = {
            startDate: payload.startDate.toISOString().split('T')[0], // ISO format 'yyyy-mm-dd'
            endDate: payload.endDate.toISOString().split('T')[0]
        };
        const result = await axios.post(
            RestApis.finance_service_income + "/find-by-date",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchCalculateTotalIncomeByDate = createAsyncThunk(
    'finance/fetchCalculateTotalIncomeByDate',
    async (payload: IFetchFindIncomeByDate) => {
        const values = {
            startDate: payload.startDate.toISOString().split('T')[0], // ISO format 'yyyy-mm-dd'
            endDate: payload.endDate.toISOString().split('T')[0]
        };
        const result = await axios.post(
            RestApis.finance_service_income + "/calculate",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindIncomeById = createAsyncThunk(
    'finance/fetchFindIncomeById',
    async (id: number) => {
        const result = await axios.post(
            RestApis.finance_service_income + "/find-by-id?id=" + id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IfetchFindAllIncomes {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllIncomes = createAsyncThunk(
    'finance/fetchFindAllIncomes',
    async (payload: IfetchFindAllIncomes) => {
        const values = {
            searchText: payload.searchText,
            page: payload.page,
            size: payload.size
        };
        const result = await axios.post(
            RestApis.finance_service_income + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchIncomeByMonths = createAsyncThunk(
    'finance/fetchIncomeByMonths',
    async (payload: IFetchFindIncomeByDate) => {
        const values = {
            startDate: payload.startDate.toISOString().split('T')[0], // ISO format 'yyyy-mm-dd'
            endDate: payload.endDate.toISOString().split('T')[0]
        };
        const result = await axios.post(
            RestApis.finance_service_income + "/get-for-months",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchGetHighestIncomeSources = createAsyncThunk(
    'finance/fetchGetHighestIncomeSources',
    async (payload: IFetchFindIncomeByDate) => {
        const values = {
            startDate: payload.startDate.toISOString().split('T')[0],
            endDate: payload.endDate.toISOString().split('T')[0]
        };
        const result = await axios.post(
            RestApis.finance_service_income + "/get-most",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
//#endregion Income


//#region Invoice
interface IFetchSaveInvoice {
    customerIdOrSupplierId: number;
    invoiceDate: Date;
    totalAmount: number;
    paidAmount: number;
    invoiceStatus: string;
    description: string;
}

export const fetchSaveInvoice = createAsyncThunk(
    'finance/fetchSaveInvoice',
    async (payload: IFetchSaveInvoice) => {
        const invoice = {
            customerIdOrSupplierId: payload.customerIdOrSupplierId,
            invoiceDate: payload.invoiceDate,
            totalAmount: payload.totalAmount,
            paidAmount: payload.paidAmount,
            invoiceStatus: payload.invoiceStatus,
            description: payload.description
        };
        const result = await axios.post(
            RestApis.finance_service_invoice + "/save",
            invoice,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)

interface IFetchUpdateInvoice {
    id: number;
    customerIdOrSupplierId: number;
    invoiceDate: Date;
    totalAmount: number;
    paidAmount: number;
    invoiceStatus: string;
    description: string;
}

export const fetchUpdateInvoice = createAsyncThunk(
    'finance/fetchUpdateInvoice',
    async (payload: IFetchUpdateInvoice) => {
        const invoice = {
            id: payload.id,
            customerIdOrSupplierId: payload.customerIdOrSupplierId,
            invoiceDate: payload.invoiceDate,
            totalAmount: payload.totalAmount,
            paidAmount: payload.paidAmount,
            invoiceStatus: payload.invoiceStatus,
            description: payload.description
        };
        const result = await axios.put(
            RestApis.finance_service_invoice + "/update",
            invoice,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)


export const fetchDeleteInvoice = createAsyncThunk(
    'finance/fetchDeleteInvoice',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.finance_service_invoice + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)


interface IfetchFindAllInvoice {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllInvoice = createAsyncThunk(
    'finance/fetchFindAllInvoice',
    async (payload: IfetchFindAllInvoice) => {
        const values = {
            searchText: payload.searchText,
            page: payload.page,
            size: payload.size
        };
        const result = await axios.post(
            RestApis.finance_service_invoice + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdInvoice = createAsyncThunk(
    'finance/fetchFindByIdInvoice',
    async (id: number) => {
        const result = await axios.post(
            RestApis.finance_service_invoice + "/find-by-id?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);
//#endregion Invoice


//#region Tax
interface IFetchSaveTax {
    taxType: string;
    taxRate: number;
    description: string;
}

export const fetchSaveTax = createAsyncThunk(
    'finance/fetchSaveTax',
    async (payload: IFetchSaveTax) => {
        const tax = {
            taxType: payload.taxType,
            taxRate: payload.taxRate,
            description: payload.description
        };
        const result = await axios.post(
            RestApis.finance_service_tax + "/save",
            tax,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)


interface IFetchUpdateTax {
    id: number;
    taxType: string;
    taxRate: number;
    description: string;
}

export const fetchUpdateTax = createAsyncThunk(
    'finance/fetchUpdateTax',
    async (payload: IFetchUpdateTax) => {
        const tax = {
            id: payload.id,
            taxType: payload.taxType,
            taxRate: payload.taxRate,
            description: payload.description
        };
        const result = await axios.put(
            RestApis.finance_service_tax + "/update",
            tax,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)

export const fetchDeleteTax = createAsyncThunk(
    'finance/fetchDeleteTax',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.finance_service_tax + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)

interface IfetchFindAllTax {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllTax = createAsyncThunk(
    'finance/fetchFindAllTax',
    async (payload: IfetchFindAllTax) => {
        const values = {
            searchText: payload.searchText,
            page: payload.page,
            size: payload.size
        };
        const result = await axios.post(
            RestApis.finance_service_tax + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdTax = createAsyncThunk(
    'finance/fetchFindByIdTax',
    async (id: number) => {
        const result = await axios.post(
            RestApis.finance_service_tax + "/find-by-id?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);

interface IFetchCalculateTax {
    id: number;
    amount: number;
}

export const fetchCalculateTax = createAsyncThunk(
    'finance/fetchCalculateTax',
    async (payload: IFetchCalculateTax) => {
        const values = {
            id: payload.id,
            amount: payload.amount
        };
        const result = await axios.post(
            RestApis.finance_service_tax + "/calculate",
            values,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
);
//#endregion Tax

//#region Department
export const fetchGetDepartmentList = createAsyncThunk(
    'finance/fetchGetDepartmentList',
    async () => {
        const result = await axios.post(
            RestApis.finance_service_department + "/get-departments",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);


const financeSlice = createSlice({
    name: 'finance',
    initialState: initialFinanceState,
    reducers: {
        closeModal: () => {
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFindAllBudget.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.budgetList = action.payload.data;
            })
            .addCase(fetchFindByIdBudget.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.budgetList = action.payload.data;
            })
            .addCase(fetchFindAllExpense.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.expenseList = action.payload.data;
            })
            .addCase(fetchFindByIdExpense.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.expenseList = action.payload.data;
            })
            .addCase(fetchGetAllExpenseCategories.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.expenseList = action.payload.data;
            })
            .addCase(fetchFindExpenseByDate.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.expenseList = action.payload.data;
            })
            .addCase(fetchFindAllFinancialReport.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.financialReportList = action.payload.data;
            })
            .addCase(fetchFindByIdFinancialReport.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.financialReportList = action.payload.data;
            })
            .addCase(fetchFindIncomeByDate.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.incomeList = action.payload.data;
            })
            .addCase(fetchFindAllInvoice.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.invoiceList = action.payload.data;
            })
            .addCase(fetchFindByIdInvoice.fulfilled, (state, action) => {
                state.invoiceList = action.payload.data;
            })
            .addCase(fetchFindAllTax.fulfilled, (state, action) => {
                state.taxList = action.payload.data;
            })
            .addCase(fetchFindByIdTax.fulfilled, (state, action) => {
                state.taxList = action.payload.data;
            })
    }
});

export default financeSlice.reducer;
export const {closeModal} = financeSlice.actions;
