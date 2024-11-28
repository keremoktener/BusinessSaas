import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../model/IUser";
import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../model/IResponse";
import RestApis from "../../config/RestApis";
import { IPageableUserList } from "../../model/IPageableUserList";
import Swal from "sweetalert2";

interface IUserState {
    user: IUser
    userRoleList: string[]
    userList: IUser[]
    pagableUserList: IPageableUserList
    isLoading: boolean
}

const initialUserState: IUserState = {
    user: {
        id: 0,
        authId: 0,
        firstName: "",
        lastName: "",
        email: "",
        userRoles: []
    },
    userRoleList: [],
    userList: [],
    pagableUserList: {
        userList: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0
    },
    isLoading: false
    
};

//----------------------------------------------------

interface IFetchSaveUser {
    firstName: string
    lastName: string
    email: string
    password: string
    roleIds: number[] 
}
/**
 * Admin tarafından bir kullanıcının kaydedilmesi işlemi için kullanılır
 * 
 * @param {IFetchSaveUser} payload - Kullanıcı bilgileri
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt
 * 
 */
export const fetchSaveUser = createAsyncThunk(
    'user/fetchSaveUser',
    async (payload: IFetchSaveUser) => {
        const user = { firstName: payload.firstName, lastName: payload.lastName, email: payload.email, password: payload.password, roleIds: payload.roleIds };
        const result = await axios.post(RestApis.user_management_service_user+"/save-user", 
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
);

//----------------------------------------------------


interface IFetchUpdateUser {
    authId: number,
    firstName: string,
    lastName: string,
    email: string,
}
/**
 * Bir kullancı kendi profilindeki bilgileri değiştirmek istediğinde kullanılır. AuthId giriş yapan kullanıcının id'sidir. 
 * 
 * @param {IFetchUpdateUser} payload - Kullanıcı bilgileri
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt
 */
export const fetchUpdateUser = createAsyncThunk(
    'user/fetchUpdateUser',
    async (payload: IFetchUpdateUser) => {
        const user = { authId: payload.authId, firstName: payload.firstName, lastName: payload.lastName, email: payload.email };
        const result = await axios.put(RestApis.user_management_service_user+"/update-user",
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
);


//----------------------------------------------------


/**
 * Admin bir kullanıcının hesabını soft delete yapmak istediğinde kullanılır.
 * 
 * @param {number} userId - Kullanıcının id'sidir
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt.
 */
export const fetchDeleteUser = createAsyncThunk(
    'user/fetchDeleteUser',
    async (userId: number) => {
        const result = await axios.put(RestApis.user_management_service_user+"/delete-user", 
            userId,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
);


//----------------------------------------------------


/**
 * 
 * Admin tarafından kullanıcı listesini getirmek istediğinde kullanılır. Kayıt olup rol bekleyen unasigned rolündeki kullanıcılara rol atanması istenirken kullanılabilir.
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt içersinde kullanıcı listesi bulunur.
 * 
 */
export const fetchUserList = createAsyncThunk(
    'user/fetchUserList',
    async () => {
        const result = await axios.get(RestApis.user_management_service_user+"/get-all-users",
            
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
);

//----------------------------------------------------


/**
 * Admin tarafından  kullanıcılara rol atamak amaçlı kullanılır.
 * 
 * @param {number} userId - Rol atanmak istenen kullanıcının userId'sidir
 * @param {number} roleId - Atanılacak rol id'sidir
 */
export const fetchAddRoleToUser = createAsyncThunk(
    'user/fetchAddRoleToUser',
    async (addRoleToUserPayload: { userId: number, roleId: number }) => {
        const result = await axios.put(RestApis.user_management_service_user+"/add-role-to-user",
            addRoleToUserPayload,
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
 * Giriş yapan kullanıcının rol bilgisini getirmek istediğinde kullanılır.
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıtta kullanıcının rolleri bulunur.
 */

export const fetchUserRoles = createAsyncThunk(
    'user/fetchUserRoles',
    async () => {
        const result = await axios.get(RestApis.user_management_service_user+"/get-user-roles",
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
 * Kullanıcı bilgilerini güncellemek istediğinde var olan bilgilerini getirmek amacıyla kullanılır.
 */

export const fetchUserInformation = createAsyncThunk(
    'user/fetchUserInformation',
    async () => {
        const result = await axios.get(RestApis.user_management_service_user+"/get-users-profile-information",
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

export const fetchChangeUserEmail = createAsyncThunk(
    'user/fetchChangeUserMail',
    async (payload: {id: number, email: string}) => {
        const result = await axios.put(RestApis.user_management_service_user+"/change-user-email",
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

export const fetchChangeUserPassword = createAsyncThunk(
    'user/fetchChangeUserPassword',
    async (payload: {userId: number}) => {
        const result = await axios.put(RestApis.user_management_service_user+"/change-user-password",
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
export const fetchUpdateUserStatus = createAsyncThunk(
    'user/fetchUpdateUserStatus',
    async (payload: {userId: number, status: string}) => {
        const result = await axios.put(RestApis.user_management_service_user+"/update-user-status",
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

export const fetchGetAllUsersPageable = createAsyncThunk(
    'user/fetchGetAllUsersPageable',
    async (payload: {searchText: string ,page: number, size: number}) => {
        const result = await axios.post(RestApis.user_management_service_user+"/get-users-with-page",
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

/**
 * Gets user information by authId.
 * @param {number} authId - user's authId.
 * @returns {Promise<AxiosResponse<IResponse>>} - response from the server.
 */
export const fetchUserInformationById = createAsyncThunk(
    'user/fetchUserInformationById',
    async (authId: number) => {
        const result = await axios.post(
            `${RestApis.user_management_service_user}/get-users-profile-information-by-id?authId=${authId}`,
            null,
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

const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        clearRoles(state){
            localStorage.removeItem('userRoleList');
            state.userRoleList = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserList.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code){
                state.userList = action.payload.data;
            }
        });

        builder.addCase(fetchUserRoles.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code){
                state.userRoleList = action.payload.data;
                localStorage.setItem('userRoleList', JSON.stringify(action.payload.data));
            }
        });

        builder.addCase(fetchUserInformation.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code == 200){
                state.user = action.payload.data;
            }
        });
        builder.addCase(fetchGetAllUsersPageable.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code == 200){
                state.pagableUserList = action.payload.data;
                state.userList = action.payload.data.userList;
            }
        })
    }
});

export const {
    clearRoles
} = userSlice.actions;
export default userSlice.reducer;