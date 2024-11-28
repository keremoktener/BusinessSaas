import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {IResponse} from "../../model/IResponse";
import {IDepartment} from "../../model/OrganizationManagementService/IDepartment.tsx";
import {IManager} from "../../model/OrganizationManagementService/IManager.tsx";
import {IEmployee} from "../../model/OrganizationManagementService/IEmployee.tsx";


interface IOrganizationManagementState {
    departmentList: IDepartment[]
    managerList: IManager[]
    employeeList: IEmployee[]

}

const initialOrganizationManagementState: IOrganizationManagementState = {
    departmentList: [],
    managerList: [],
    employeeList: [],


}

//#region Department
interface IfetchSaveDepartment {
    name: string;
}

export const fetchSaveDepartment = createAsyncThunk(
    'organization-management/fetchSaveDepartment',
    async (payload: IfetchSaveDepartment) => {
        const usersName = {name: payload.name};

        const result = await axios.post(
            RestApis.organization_management_department + "/save",
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

export const fetchDeleteDepartment = createAsyncThunk(
    'organization-management/fetchDeleteDepartment',
    async (id: number) => {

        const result = await axios.delete(
            RestApis.organization_management_department + "/delete?id=" + id,
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


interface IfetchUpdateDepartment {
    id: number;
    name: string;
}

export const fetchUpdateDepartment = createAsyncThunk(
    'organization-management/fetchUpdateDepartment',
    async (payload: IfetchUpdateDepartment) => {
        const values = {id: payload.id, name: payload.name};

        const result = await axios.put(
            RestApis.organization_management_department + "/update",
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

interface IfetchFindAllDepartment {

    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllDepartment = createAsyncThunk(
    'organization-management/fetchFindAllDepartment',
    async (payload: IfetchFindAllDepartment) => {
        const values = {searchText: payload.searchText, page: payload.page, size: payload.size};

        const result = await axios.post(
            RestApis.organization_management_department + "/find-all",
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

export const fetchFindByIdDepartment = createAsyncThunk(
    'organization-management/fetchFindByIdDepartment',
    async (id: number) => {


        const result = await axios.post(
            RestApis.organization_management_department + "/find-by-id?id=" + id,
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

//#endregion

//#region Employee
interface IfetchSaveEmployee {
    managerId: number;
    departmentId: number;
    identityNo: string;
    phoneNo: string;
    title: string;
    name: string;
    surname: string;
    email: string;
}

export const fetchSaveEmployee = createAsyncThunk(
    'organization-management/fetchSaveEmployee',
    async (payload: IfetchSaveEmployee) => {
        const usersName = {
            managerId: payload.managerId,
            departmentId: payload.departmentId,
            identityNo: payload.identityNo,
            phoneNo: payload.phoneNo,
            name: payload.name,
            title: payload.title,
            surname: payload.surname,
            email: payload.email
        };

        const result = await axios.post(
            RestApis.organization_management_employee + "/save",
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


interface IfetchSaveTopLevelManager {
    departmentId: number;
    identityNo: string;
    phoneNo: string;
    title: string;
    name: string;
    surname: string;
    email: string;
}

export const fetchSaveTopLevelManager = createAsyncThunk(
    'organization-management/fetchSaveTopLevelManager',
    async (payload: IfetchSaveTopLevelManager) => {
        const usersName = {

            departmentId: payload.departmentId,
            identityNo: payload.identityNo,
            phoneNo: payload.phoneNo,
            name: payload.name,
            title: payload.title,
            surname: payload.surname,
            email: payload.email
        };

        const result = await axios.post(
            RestApis.organization_management_employee + "/save-top-level-manager",
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


interface IfetchSaveSubordinate {
    managerId: number;
    departmentId: number;
    identityNo: string;
    phoneNo: string;
    title: string;
    name: string;
    surname: string;
    email: string;
}

export const fetchSaveSubordinate = createAsyncThunk(
    'organization-management/fetchSaveSubordinate',
    async (payload: IfetchSaveSubordinate) => {
        const usersName = {
            managerId: payload.managerId,
            departmentId: payload.departmentId,
            identityNo: payload.identityNo,
            phoneNo: payload.phoneNo,
            name: payload.name,
            title: payload.title,
            surname: payload.surname,
            email: payload.email
        };

        const result = await axios.post(
            RestApis.organization_management_employee + "/save-subordinate",
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

export const fetchDeleteEmployee = createAsyncThunk(
    'organization-management/fetchDeleteEmployee',
    async (id: number) => {

        const result = await axios.delete(
            RestApis.organization_management_employee + "/delete?id=" + id,
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


interface IfetchUpdateEmployee {
    id: number;
    managerId: number;
    departmentId: number;
    identityNo: string;
    title: string;
    email: string;
    phoneNo: string;
    name: string;
    surname: string;
}

export const fetchUpdateEmployee = createAsyncThunk(
    'organization-management/fetchUpdateEmployee',
    async (payload: IfetchUpdateEmployee) => {
        const values = {
            id: payload.id,
            managerId: payload.managerId,
            departmentId: payload.departmentId,
            identityNo: payload.identityNo,
            phoneNo: payload.phoneNo,
            name: payload.name,
            surname: payload.surname,
            email: payload.email,
            title : payload.title
        };

        const result = await axios.put(
            RestApis.organization_management_employee + "/update",
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

interface IfetchFindAllEmployee {

    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllEmployee = createAsyncThunk(
    'organization-management/fetchFindAllEmployee',
    async (payload: IfetchFindAllEmployee) => {
        const values = {searchText: payload.searchText, page: payload.page, size: payload.size};

        const result = await axios.post(
            RestApis.organization_management_employee + "/find-all",
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
    'organization-management/fetchFindByIdEmployee',
    async (id: number) => {


        const result = await axios.post(
            RestApis.organization_management_employee + "/find-by-id?id=" + id,
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

export const fetchGetEmployeeHierarchy = createAsyncThunk(
    'organization-management/fetchGetEmployeeHierarchy',
    async () => {
        const result = await axios.post(
            RestApis.organization_management_employee + "/get-employee-hierarchy",
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

export const fetchChangeIsAccountGivenStateOfEmployee = createAsyncThunk(
    'organization-management/fetchFindByIdEmployee',
    async (id: number) => {


        const result = await axios.post(
            RestApis.organization_management_employee + "/change-is-account-given-to-employee-state?id=" + id,
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


//#endregion

//#region Manager
interface IfetchSaveManager {
    departmentId: number;
    identityNo: string;
    phoneNo: string;
    name: string;
    surname: string;
    email: string;
}

export const fetchSaveManager = createAsyncThunk(
    'organization-management/fetchSaveManager',
    async (payload: IfetchSaveManager) => {
        const usersName = {
            departmentId: payload.departmentId,
            identityNo: payload.identityNo,
            phoneNo: payload.phoneNo,
            name: payload.name,
            surname: payload.surname,
            email: payload.email
        };

        const result = await axios.post(
            RestApis.organization_management_manager + "/save",
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

export const fetchDeleteManager = createAsyncThunk(
    'organization-management/fetchDeleteManager',
    async (id: number) => {

        const result = await axios.delete(
            RestApis.organization_management_manager + "/delete?id=" + id,
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


interface IfetchUpdateManager{
    id: number;
    departmentId: number;
    identityNo: string;
    phoneNo: string;
    name: string;
    surname: string;
}

export const fetchUpdateManager = createAsyncThunk(
    'organization-management/fetchUpdateManager',
    async (payload: IfetchUpdateManager) => {
        const values = {
            id: payload.id,
            departmentId: payload.departmentId,
            identityNo: payload.identityNo,
            phoneNo: payload.phoneNo,
            name: payload.name,
            surname: payload.surname
        };

        const result = await axios.put(
            RestApis.organization_management_manager + "/update",
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

interface IfetchFindAllManager {

    searchText: string;
    page: number;
    size: number;
}

export const fetchFindAllManager = createAsyncThunk(
    'organization-management/fetchFindAllManager',
    async (payload: IfetchFindAllManager) => {
        const values = {searchText: payload.searchText, page: payload.page, size: payload.size};

        const result = await axios.post(
            RestApis.organization_management_manager + "/find-all",
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

export const fetchFindByIdManager = createAsyncThunk(
    'organization-management/fetchFindByIdManager',
    async (id: number) => {


        const result = await axios.post(
            RestApis.organization_management_manager + "/find-by-id?id=" + id,
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

//#endregion

const organizationManagementSlice = createSlice({
    name: 'organization-management',
    initialState: initialOrganizationManagementState,
    reducers: {
        closeModal: () => {

        },
    },
    extraReducers: (build) => {


    }
});

export default organizationManagementSlice.reducer;
export const {} = organizationManagementSlice.actions