import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import { IAttendance, } from "../../model/IAttendance";
import { IBenefit } from "../../model/IBenefit";
import { IEmployee } from "../../model/IEmployee";
import { IPayroll } from "../../model/IPayroll";
import { IPerformance } from "../../model/IPerformance";
import { IResponse } from "../../model/IResponse";





interface IHrmState  {
    attendanceList:IAttendance[]
    benefitList:IBenefit[]
    employeeList:IEmployee[]
    payrollList:IPayroll[]
    performanceList:IPerformance[]
    birthDateList: BirthDateResponseDTO[];
    departmentScoreList: DepartmentScoreResponseDTO[];
    numberOfMen: number;
    departmentEmployeeCount: IDepartmentEmployeeCount; 
    numberOfWomen: number;
}

const initialHrmState:IHrmState = {
    attendanceList: [],
    benefitList:[],
    employeeList:[],
    payrollList:[],
    birthDateList: [],
    departmentScoreList: [],
    numberOfMen: 0,
    numberOfWomen: 0,
    departmentEmployeeCount: {},
    performanceList:[]
    
}


//#region Employee
interface IfetchSaveEmployee{
    firstName:string;
    lastName:string;
    position:string;
    department:string;
    email:string;
    phone:string;
    birthDate:Date;
    gender:string;
    hireDate:Date;
    salary:number;
    
}

export const fetchSaveEmployee = createAsyncThunk(
    'hrm/fetchSaveEmployee',
    async (payload:IfetchSaveEmployee) => {
        const usersName = { 
            firstName: payload.firstName,
            lastName: payload.lastName,
            position: payload.position,
            department: payload.department,
            email: payload.email,
            phone: payload.phone,
            birthDate: payload.birthDate,
            gender: payload.gender,
            hireDate: payload.hireDate,
            salary: payload.salary
        };
        const result = await axios.post(
            RestApis.hrm_service_employee+"/save",
            usersName,
            {
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
interface IfetchUpdateEmployee{
    
    id:number;
    firstName:string;
    lastName:string;
    position:string;
    department:string;
    email:string;
    phone:string;
    birthDate:Date;
    gender:string;
    hireDate:Date;
    salary:number;
    
}
export const fetchUpdateEmployee = createAsyncThunk(
    'hrm/fetchUpdateEmployee',
    async (payload:IfetchUpdateEmployee) => {
        const values = { 
            id: payload.id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            position: payload.position,
            department: payload.department,
            email: payload.email,
            phone: payload.phone,
            birthDate: payload.birthDate,
            gender: payload.gender,
            hireDate: payload.hireDate,
            salary: payload.salary
        };
        const result = await axios.put(
            RestApis.hrm_service_employee+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);


export const fetchFindByIdEmployee = createAsyncThunk(
    'hrm/fetchFindByIdEmployee',
    async (id:number) => {
        const result = await axios.post(
            RestApis.hrm_service_employee+"/find-by-id?id="+id,null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IfetchFindAllEmployee{
    searchText:string;
    page:number;
    size:number;

}
export const fetchFindAllEmployee = createAsyncThunk(
    'hrm/fetchFindAllEmployee',
    async (payload:IfetchFindAllEmployee) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };
        const result = await axios.post(
            RestApis.hrm_service_employee+"/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchDeleteEmployee = createAsyncThunk(
    'hrm/fetchDeleteEmployee',
    async (id:number) => {
        const result = await axios.delete(
            RestApis.hrm_service_employee+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)

export const fetchNumberOfEmployeeMen = createAsyncThunk(
    'hrm/fetchNumberOfEmployeeMen',
    async () => {
        const result = await axios.post(
            RestApis.hrm_service_employee + "/number-men",
            null, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                },
            }
        );
        return result.data; 
    }
);
export const fetchNumberOfEmployeeWomen = createAsyncThunk(
    'hrm/fetchNumberOfEmployeeWomen',
    async () => {
        const result = await axios.post(
            RestApis.hrm_service_employee + "/number-women",
            null, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                },
            }
        );
        return result.data; 
    }
);

interface IDepartmentEmployeeCount {
    [departmentName: string]: number; 
}

export const fetchNumberOfEmployeesInDepartments = createAsyncThunk(
    'hrm/fetchNumberOfEmployeesInDepartments',
    async () => {
        const result = await axios.post(
            RestApis.hrm_service_employee + "/number-departments",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token'),
                },
            }
        );
        return result.data;
    }
);
interface BirthDateResponseDTO{
    
    firstName:string;
    lastName:string;
    birthDate:string;
   
    
}

export const fetchUpcomingBirthdays = createAsyncThunk(
    'hrm/fetchUpcomingBirthdays',
    async () => {
        const result = await axios.post<BirthDateResponseDTO[]>(
            RestApis.hrm_service_employee + "/birthdate-list",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

//#region Attendance
interface IfetchSaveAttendance{
    employeeId:number;
    date:Date;
    checkInTime: string;
    checkOutTime: string;
  
    
}

export const fetchSaveAttendance = createAsyncThunk(
    'hrm/fetchSaveAttendance',
    async (payload:IfetchSaveAttendance) => {
        const usersName = { 
            employeeId: payload.employeeId,
            date: payload.date,
            checkInTime: payload.checkInTime,
            checkOutTime: payload.checkOutTime
        };
        const result = await axios.post(
            RestApis.hrm_service_attendance+"/save",
            usersName,
            {
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IfetchUpdateAttendance{
    
    id:number;
    employeeId:number;
    date:Date;
    checkInTime: string;
    checkOutTime: string;
    
}
export const fetchUpdateAttendance = createAsyncThunk(
    'hrm/fetchUpdateAttendance',
    async (payload:IfetchUpdateAttendance) => {
        const values = { 
            id: payload.id,
            employeeId: payload.employeeId,
            date: payload.date,
            checkInTime: payload.checkInTime,
            checkOutTime: payload.checkOutTime
        };
        const result = await axios.put(
            RestApis.hrm_service_attendance+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdAttendance = createAsyncThunk(
    'hrm/fetchFindByIdAttendance',
    async (id:number) => {
        const result = await axios.post(
            RestApis.hrm_service_attendance+"/find-by-id?id="+id,null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
export const fetchDeleteAttendance = createAsyncThunk(
    'hrm/fetchDeleteAttendance',
    async (id:number) => {
        const result = await axios.delete(
            RestApis.hrm_service_attendance+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)
interface IfetchFindAllAttendance {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllAttendance = createAsyncThunk(
    'hrm/fetchFindAllAttendance',
    async (payload: IfetchFindAllAttendance) => {
        const values = { searchText: payload.searchText, page: payload.page, size: payload.size };
        const result = await axios.post(
            RestApis.hrm_service_attendance + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

//#region Benefit

interface IfetchSaveBenefit{
    employeeId:number;
    type: string;
    amount: number;
    startDate: Date;
    endDate: Date;
  
    
}

export const fetchSaveBenefit = createAsyncThunk(
    'hrm/fetchSaveBenefit',
    async (payload:IfetchSaveBenefit) => {
        const usersName = { 
            employeeId: payload.employeeId,
            type: payload.type,
            amount: payload.amount,
            startDate: payload.startDate,
            endDate: payload.endDate
        };
        const result = await axios.post(
            RestApis.hrm_service_benefit+"/save",
            usersName,
            {
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IfetchUpdateBenefit{
    
    id:number;
    employeeId:number;
    type: string;
    amount: number;
    startDate: Date;
    endDate: Date;

    
}
export const fetchUpdateBenefit = createAsyncThunk(
    'hrm/fetchUpdateBenefit',
    async (payload:IfetchUpdateBenefit) => {
        const values = { 
            id: payload.id,
            employeeId: payload.employeeId,
            type: payload.type,
            amount: payload.amount,
            startDate: payload.startDate,
            endDate: payload.endDate
        };
        const result = await axios.put(
            RestApis.hrm_service_benefit+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdBenefit = createAsyncThunk(
    'hrm/fetchFindByIdBenefit',
    async (id:number) => {
        const result = await axios.post(
            RestApis.hrm_service_benefit+"/find-by-id?id="+id,null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
export const fetchDeleteBenefit = createAsyncThunk(
    'hrm/fetchDeleteBenefit',
    async (id:number) => {
        const result = await axios.delete(
            RestApis.hrm_service_benefit+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)
interface IfetchFindAllBenefit {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllBenefit = createAsyncThunk(
    'hrm/fetchFindAllBenefit',
    async (payload: IfetchFindAllBenefit) => {
        const values = { searchText: payload.searchText, page: payload.page, size: payload.size };
        const result = await axios.post(
            RestApis.hrm_service_benefit + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);






//#region Payroll

interface IfetchSavePayroll{
    employeeId:number;
    salaryDate:Date;
    grossSalary:number;
    deductions:number;
    netSalary:number;
  
    
}

export const fetchSavePayroll = createAsyncThunk(
    'hrm/fetchSavePayroll',
    async (payload:IfetchSavePayroll) => {
        const usersName = { 
            employeeId: payload.employeeId,
            salaryDate: payload.salaryDate,
            grossSalary: payload.grossSalary,
            deductions: payload.deductions,
            netSalary: payload.netSalary
        };
        const result = await axios.post(
            RestApis.hrm_service_payroll+"/save",
            usersName,
            {
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IfetchUpdatePayroll{
    
    id:number;
    employeeId:number;
    salaryDate:Date;
    grossSalary:number;
    deductions:number;
    netSalary:number;

    
}
export const fetchUpdatePayroll = createAsyncThunk(
    'hrm/fetchUpdatePayroll',
    async (payload:IfetchUpdatePayroll) => {
        const values = { 
            id: payload.id,
            employeeId: payload.employeeId,
            salaryDate: payload.salaryDate,
            grossSalary: payload.grossSalary,
            deductions: payload.deductions,
            netSalary: payload.netSalary
        };
        const result = await axios.put(
            RestApis.hrm_service_payroll+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdPayroll = createAsyncThunk(
    'hrm/fetchFindByIdPayroll',
    async (id:number) => {
        const result = await axios.post(
            RestApis.hrm_service_payroll+"/find-by-id?id="+id,null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
export const fetchDeletePayroll = createAsyncThunk(
    'hrm/fetchDeletePayroll',
    async (id:number) => {
        const result = await axios.delete(
            RestApis.hrm_service_payroll+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)
interface IfetchFindAllPayroll {
    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllPayroll = createAsyncThunk(
    'hrm/fetchFindAllPayroll',
    async (payload: IfetchFindAllPayroll) => {
        const values = { searchText: payload.searchText, page: payload.page, size: payload.size };
        const result = await axios.post(
            RestApis.hrm_service_payroll + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);


//#region Performance

interface IfetchSavePerformance{
    employeeId:number;
    date: Date;
    score: number;
    feedback: string;
  
    
}

export const fetchSavePerformance = createAsyncThunk(
    'hrm/fetchSavePerformance',
    async (payload:IfetchSavePerformance) => {
        const usersName = { 
            employeeId: payload.employeeId,
            date: payload.date,
            score: payload.score,
            feedback: payload.feedback
        };
        const result = await axios.post(
            RestApis.hrm_service_performance+"/save",
            usersName,
            {
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IfetchUpdatePerformance{
    
    id:number;
    employeeId:number;
    date: Date;
    score: number;
    feedback: string;
    
}
export const fetchUpdatePerformance = createAsyncThunk(
    'hrm/fetchUpdatePerformance',
    async (payload:IfetchUpdatePerformance) => {
        const values = { 
            id: payload.id,
            employeeId: payload.employeeId,
            date: payload.date,
            score: payload.score,
            feedback: payload.feedback
        };
        const result = await axios.put(
            RestApis.hrm_service_performance+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                   'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchFindByIdPerformance = createAsyncThunk(
    'hrm/fetchFindByIdPerformance',
    async (id:number) => {
        const result = await axios.post(
            RestApis.hrm_service_performance+"/find-by-id?id="+id,null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
export const fetchDeletePerformance = createAsyncThunk(
    'hrm/fetchDeletePerformance',
    async (id:number) => {
        const result = await axios.delete(
            RestApis.hrm_service_performance+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)
interface IfetchFindAllPerformance {
    searchText: string;
    page: number;
    size: number;
}
export const fetchFindAllPerformance = createAsyncThunk(
    'hrm/fetchFindAllPerformance',
    async (payload: IfetchFindAllPerformance) => {
        const values = { searchText: payload.searchText, page: payload.page, size: payload.size };
        const result = await axios.post(
            RestApis.hrm_service_performance + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface DepartmentScoreResponseDTO{
    department: string;
    averageScore: number;

    
}
export const fetchDepartmentAverageScores = createAsyncThunk(
    'hrm/fetchDepartmentAverageScores',
    async () => {
        const result = await axios.post(
            RestApis.hrm_service_performance + "/department-score", 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);


const hrmSlice = createSlice({
    name: 'hrm',
    initialState: initialHrmState,
    reducers: {
        closeModal: () => {

        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFindAllEmployee.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.employeeList = action.payload.data;
        });
        builder.addCase(fetchFindAllPayroll.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.payrollList = action.payload.data;
        });
        builder.addCase(fetchFindAllPerformance.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.performanceList = action.payload.data;
        });
        builder.addCase(fetchFindAllBenefit.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.benefitList = action.payload.data;
        });
        builder.addCase(fetchFindAllAttendance.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.attendanceList = action.payload.data;
        });
        builder.addCase(fetchNumberOfEmployeeMen.fulfilled, (state, action: PayloadAction<number>) => {
            state.numberOfMen = action.payload; 
        });
        builder.addCase(fetchNumberOfEmployeeWomen.fulfilled, (state, action: PayloadAction<number>) => {
            state.numberOfWomen = action.payload; 
        });
        builder.addCase(fetchNumberOfEmployeesInDepartments.fulfilled, (state, action: PayloadAction<IDepartmentEmployeeCount>) => {
            state.departmentEmployeeCount = action.payload; 
            
        });
        builder.addCase(fetchUpcomingBirthdays.fulfilled, (state, action: PayloadAction<BirthDateResponseDTO[]>) => {
            state.birthDateList = action.payload; 
        });
        builder.addCase(fetchDepartmentAverageScores.fulfilled, (state, action: PayloadAction<DepartmentScoreResponseDTO[]>) => {
            state.departmentScoreList = action.payload; 
        });
      
      
    }
});

export default hrmSlice.reducer;

export const {} = hrmSlice.actions;