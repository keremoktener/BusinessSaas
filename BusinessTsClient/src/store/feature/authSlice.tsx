import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";
import axios from "axios";
import { IResponse } from "../../model/IResponse";
import Swal from "sweetalert2";


interface IAuthState {
    token: string;
    user: any[]; 
    isLoadingLogin: boolean;
    isLoadingRegister: boolean;
    isAuth: boolean;
    isLoadingVerifyAccount: boolean;

}

const initialAuthState: IAuthState = {
    token: '',
    user: [],
    isLoadingLogin: false,
    isLoadingRegister: false,
    isAuth: false,
    isLoadingVerifyAccount: false,
  
};

interface IFetchRegister{
    firstName: string;
    lastName: string;
    email: string; 
    password: string;
    rePassword: string;
}

export const fetchRegister = createAsyncThunk(
    'auth/fetchRegister',
    async (payload: IFetchRegister, { rejectWithValue }) => {
        try {
            const response = await axios.post(RestApis.auth_service + '/register', {
                'firstName': payload.firstName,
                'lastName': payload.lastName,
                'email': payload.email,
                'password': payload.password,
                'rePassword': payload.rePassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data; 
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'Kayıt işlemi sırasında bir hata oluştu.' });
            }
        }
    }
);

interface IFetchVerifyAccount{
    token: string;
}


export const fetchVerifyAccount = createAsyncThunk(
    'auth/fetchVerifyAccount',
    async (payload: IFetchVerifyAccount, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RestApis.auth_service}/verify-account`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    token: payload.token 
                }
            });

            console.log(response.data);
            return response.data; 
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) { 
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'An error occurred during the verification process.' });
            }
        }
    }
);

interface IFetchLogin{
    email: string;
    password: string;
}

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async (payload: IFetchLogin, { rejectWithValue }) => {
        try {
            const response = await axios.post(RestApis.auth_service + '/login', {
                email: payload.email,
                password: payload.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'Giriş işlemi sırasında bir hata oluştu.' });
            }
        }
    }
);

interface IFetchForgotPassword{
    email: string;
}

export const fetchForgotPassword = createAsyncThunk(
    'auth/fetchForgotPassword',
    async (payload: IFetchForgotPassword, { rejectWithValue }) => {
        try {
            const response = await axios.post(RestApis.auth_service + '/forget-password?email=' + payload.email, 
                {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'Bir hata oluştu.' });
            }
        }
    }
);

interface IFetchResetPassword{
    token: string;
    newPassword: string;
    rePassword: string;
}


export const fetchResetPassword = createAsyncThunk(
    'auth/fetchResetPassword',
    async (payload: IFetchResetPassword, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${RestApis.auth_service}/reset-password`,
                payload, {
                headers: {
                    'Content-Type': 'application/json'
                    
                }
                
            });

            console.log(response.data);
            return response.data; 
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) { 
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'An error occurred during the verification process.' });
            }
        }
    }
);


/**
 * Login Profile Management işlemi profil düzenleme sayfasını görüntülemek için tekrar şifre istenmesi işleminde doğrulama amacıyla kullanılır.
 */

export const fetchLoginProfileManagement = createAsyncThunk(
    'auth/fetchLoginProfileManagement',
    async (passwordPayload: {password: string})=>{
        const result = await axios.post(RestApis.auth_service + "/login-profile-management",
            passwordPayload,
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

export const fetchChangeMyPassword = createAsyncThunk(
    'auth/fetchChangeMyPassword',
    async (passwordPayload: {authId: number, newPassword: string, newConfirmPassword: string})=>{
        const result = await axios.put(RestApis.auth_service + "/change-my-password",
            passwordPayload,
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



const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setToken(state,action: PayloadAction<string>){
            state.isAuth = true;
            state.token = action.payload;
        },
        clearToken(state){
            state.isAuth = false;
            localStorage.removeItem('token');
            state.token = '';
        }
    },
    extraReducers: (build)=>{
        build.addCase(fetchRegister.pending,(state)=>{
            state.isLoadingRegister = true;
        });
        build.addCase(fetchRegister.fulfilled,(state)=>{
            state.isLoadingRegister = false;
        });
        build.addCase(fetchVerifyAccount.pending, (state) => {
            state.isLoadingVerifyAccount = true;
        });
        build.addCase(fetchVerifyAccount.fulfilled, (state)=>{
            state.isLoadingVerifyAccount = false;
            
        });
        build.addCase(fetchLogin.pending,(state)=>{
            state.isLoadingLogin = true;
        })
        build.addCase(fetchLogin.fulfilled,(state,action: PayloadAction<IResponse>)=>{            
            state.isLoadingLogin = false;
            if(action.payload.code === 200){
                state.token = action.payload.data.token;
                state.isAuth = true;
                localStorage.setItem('token',action.payload.data.token);
            }else
            
                Swal.fire('Hata!',action.payload.message,'error');
            
        });
        build.addCase(fetchForgotPassword.pending, (state) => {
            state.isLoadingLogin = true; 
        });
        build.addCase(fetchForgotPassword.fulfilled, (state) => {
            state.isLoadingLogin = false; 
            Swal.fire('Başarılı!', 'Şifre sıfırlama e-postası gönderildi.', 'success');
        });
        build.addCase(fetchForgotPassword.rejected, (state, action: PayloadAction<any>) => {
            state.isLoadingLogin = false;
            Swal.fire('Hata!', action.payload?.message || 'Bir hata oluştu.', 'error');
        });
        build.addCase(fetchResetPassword.pending, (state) => {
            state.isLoadingLogin = true; 
        });
        build.addCase(fetchResetPassword.fulfilled, (state) => {
            state.isLoadingLogin = false;
            Swal.fire('Başarılı!', 'Şifreniz başarıyla sıfırlandı.', 'success');
        });
        build.addCase(fetchResetPassword.rejected, (state, action: PayloadAction<any>) => {
            state.isLoadingLogin = false;
            Swal.fire('Hata!', action.payload?.message || 'Şifre sıfırlama sırasında bir hata oluştu.', 'error');
        });
        
       
       
        
    }
});

export const {
    setToken,clearToken
} = authSlice.actions;
export default authSlice.reducer;