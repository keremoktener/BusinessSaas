import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IRole } from "../../model/IRole"
import axios from "axios"
import { IResponse } from "../../model/IResponse";
import RestApis from "../../config/RestApis";

interface IRoleState {
    role: IRole
    roleList: IRole[]
    assigableRoleList: IRole[]
    isLoading: boolean
}

const initialRoleState: IRoleState = {
    role: {
        roleId: 0,
        roleName: "",
        roleDescription: "",
        status: "",
    },
    roleList: [],
    assigableRoleList: [],
    isLoading: false
}


//----------------------------------------------------
interface IFetchSaveRole {
    roleName: string
    roleDescription: string
}

/**
 * Admin tarafından bir rol kaydetme işlemi için kullanılır
 * 
 * @param {IFetchSaveRole} payload - Rol adı ve açıklaması girilir.
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan rol kayıt işlemi sonrası dönen yanıt.
 */

export const fetchSaveRole = createAsyncThunk(
    'role/fetchSaveRole',
    async (payload: IFetchSaveRole) => {
        const role = { roleName: payload.roleName, roleDescription: payload.roleDescription };
        const result = await axios.post(RestApis.user_management_service_role+"/create-user-role",
            role,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return result.data;
    }
)


//----------------------------------------------------


interface IFetchUpdateRole {
    roleId: number
    roleName: string
    roleDescription: string
}


/**
 * Admin tarafından bir rol bilgilerini güncelleme işlemi için kullanılır
 * 
 * @param {IFetchUpdateRole} payload - Güncellenecek rol bilgileri
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan rol bilgileri güncellenirken dönen yanıt
 * 
 */

export const fetchUpdateRole = createAsyncThunk(
    'role/fetchUpdateRole',
    async (payload: IFetchUpdateRole) => {
        const role = { roleId: payload.roleId, roleName: payload.roleName, roleDescription: payload.roleDescription };
        const result = await axios.put(RestApis.user_management_service_role+"/update-user-role",
            role,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return result.data;
    }
)

//----------------------------------------------------

/**
 * Admin tarafından bir rol silme (soft delete) işlemi için kullanılır.
 * 
 * 
 * @param {number} roleId - Silinecek rol id'sidir.
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt.
 * 
 */

export const fetchDeleteRole = createAsyncThunk(
    'role/fetchDeleteRole',
    async (roleId:number) => {
        const result = await axios.put(RestApis.user_management_service_role+"/delete-user-role?roleId="+roleId,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return result.data;
    }
)


//----------------------------------------------------

/**
 * 
 * Admin tarafından tüm roller görüntülenmek istendiğinde getirlirir.
 * 
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan rol listesi döner.
 * 
 */

export const fetchRoleList = createAsyncThunk(
    'role/fetchRoleList',
    async (Payload:{searchText: string ,page: number, size: number}) => {
        const result = await axios.post(RestApis.user_management_service_role+"/get-all-user-roles",
            Payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return result.data;
    }
)


//----------------------------------------------------

/**
 * Admin tarafından kullanıcıya rol eklenmek istendiğinde kullanılır.
 * 
 * 
 * @param {number} userId - Rol eklenmek istenen kullanıcının userId'sidir
 * 
 * 
 */

export const fetchAsiggableRoleList = createAsyncThunk(
    'role/fetchAsiggableRoleList',
    async (userId:number) => {
        const result = await axios.get(RestApis.user_management_service_role+"/assignable-roles/"+userId,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return result.data;
    }
)

export const fetchUpdateUserRoleStatus = createAsyncThunk(
    'role/fetchUpdateUserRoleStatus',
    async (payload: {roleId: number, status: string}) => {
        const result = await axios.put(RestApis.user_management_service_role+"/update-user-role-status",
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
)


const roleSlice = createSlice({
    name: 'role',
    initialState: initialRoleState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchRoleList.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code){
                state.roleList = action.payload.data;
            }
        });

        builder.addCase(fetchAsiggableRoleList.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code){
                state.assigableRoleList = action.payload.data;
            }
        });
    }

});

export default roleSlice.reducer;
