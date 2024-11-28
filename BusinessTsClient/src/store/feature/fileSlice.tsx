import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import RestApis from "../../config/RestApis";
import { IResponse } from "../../model/IResponse";

interface IFile {
    uuid: string;
    extension: string; 
}
  
interface IFileState {
    profileImage: string;
    uuid: string;
    files: IFile[];
    isLoading: boolean;
    error: string | null;
}
  
const initialFileState: IFileState = {
    profileImage: 'https://i.pinimg.com/736x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg',
    uuid: '',
    files: [],
    isLoading: false,
    error: null,
};
  
export const EContentType = {
    IMAGE_JPEG: { mimeType: "image/jpeg", extension: "jpg", enum: "IMAGE_JPEG" },
    IMAGE_PNG: { mimeType: "image/png", extension: "png", enum: "IMAGE_PNG" },
    APPLICATION_PDF: { mimeType: "application/pdf", extension: "pdf", enum: "APPLICATION_PDF" },
    EXCEL_XLSX: { mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extension: "xlsx", enum: "EXCEL_XLSX" }
};


const getExtensionByMimeType = (mimeType: string): string => {
    switch (mimeType) {
        case EContentType.IMAGE_JPEG.mimeType:
            return EContentType.IMAGE_JPEG.extension;
        case EContentType.IMAGE_PNG.mimeType:
            return EContentType.IMAGE_PNG.extension;
        case EContentType.APPLICATION_PDF.mimeType:
            return EContentType.APPLICATION_PDF.extension;
        case EContentType.EXCEL_XLSX.mimeType:
            return EContentType.EXCEL_XLSX.extension;
        default:
            return ''; 
    }
};

const getEnumByMimeType = (mimeType: string): string => {
    switch (mimeType) {
        case EContentType.IMAGE_JPEG.mimeType:
            return EContentType.IMAGE_JPEG.enum;
        case EContentType.IMAGE_PNG.mimeType:
            return EContentType.IMAGE_PNG.enum;
        case EContentType.APPLICATION_PDF.mimeType:
            return EContentType.APPLICATION_PDF.enum;
        case EContentType.EXCEL_XLSX.mimeType:
            return EContentType.EXCEL_XLSX.enum;
        default:
            return ''; 
    }
};


export const uploadFile = createAsyncThunk(
    'files/uploadFile',
    async (file: File, { rejectWithValue }) => {
        const formData = new FormData();
        const mimeType = file.type; // MIME türünü al image/jpeg
        const extension = getExtensionByMimeType(mimeType);
        const enum2 = getEnumByMimeType(mimeType);
        formData.append('file', file);
        formData.append('contentType', enum2);
        formData.append('token', localStorage.getItem('token') || '');

        try {
            const response = await axios.post(`${RestApis.file_service}/save`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
            });
            return response.data; 
        } catch (error) {
            return rejectWithValue('Dosya yüklenirken bir hata oluştu.');
        }
    }
);


export const deleteFile = createAsyncThunk(
    'files/deleteFile',
    async ({  bucketName, uuid }: {  bucketName: string ;uuid: string}, { rejectWithValue }) => {
        try {
       
            const response = await axios.delete(`${RestApis.file_service}/delete`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                data: {
                    uuid,
                    bucketName
                },
            });

            return response.data.data; 
        } catch (error) {
            return rejectWithValue('Dosya silinirken bir hata oluştu.');
        }
    }
);



export const updateFile = createAsyncThunk(
    'files/updateFile',
    async ({ uuid, file, contentType }: { uuid: string; file: File; contentType: string }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('uuid', uuid); 
            formData.append('file', file); 
            formData.append('contentType', contentType); 

            const response = await axios.post(`${RestApis.file_service}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            const mimeType = response.data.data.mimeType;
            const extension = getExtensionByMimeType(mimeType); 
            return { uuid, extension }; 
        } catch (error) {
            return rejectWithValue('Dosya güncellenirken bir hata oluştu.');
        }
    }
);



export const fetchFile = createAsyncThunk(
    'files/fetchFile',
    async (uuid: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RestApis.file_service}/get/${uuid}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                responseType: 'blob', 
            });
            return response.data; 
        } catch (error) {
            return rejectWithValue( 'Dosya alınırken bir hata oluştu.');
        }
    }
);

export const fetchUploadProfileImage = createAsyncThunk(
    'files/uploadProfileImage',
    async (file: File, { rejectWithValue }) => {
        const formData = new FormData();
        const mimeType = file.type; 
        const extension = getExtensionByMimeType(mimeType);
        const enum2 = getEnumByMimeType(mimeType);
        formData.append('file', file);
        formData.append('contentType', enum2);
        formData.append('token', localStorage.getItem('token') || '');

        try {
            const response = await axios.post(`${RestApis.file_service}/uploadProfileImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue('Profil resmi yüklenirken bir hata oluştu.');
        }
    }
);

export const fetchProfileImage = createAsyncThunk(
    'files/fetchGetProfileImage',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RestApis.file_service}/getProfileImage`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob', 
            });
            return response.data; 
        } catch (error) {
            return rejectWithValue('Profil resmi alınırken bir hata oluştu.');
        }
    }
);






const fileSlice = createSlice({
    name: 'files',
    initialState: initialFileState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        setProfileImage: (state, action) => {
            state.profileImage = action.payload;
        },
        clearProfileImage: (state) => {
            state.profileImage = 'https://i.pinimg.com/736x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadFile.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                state.uuid = action.payload.data;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files = state.files.filter(file => file.uuid !== action.payload);
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string; 
            })
            .addCase(updateFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateFile.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.files.findIndex(file => file.uuid === action.payload.uuid);
                if (index !== -1) {
                    state.files[index].extension = action.payload.extension; 
                }
            })
            .addCase(updateFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string; 
            })
            .addCase(fetchFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFile.fulfilled, (state, action) => {
                state.isLoading = false;
               
            })
            .addCase(fetchFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string; 
            })
            .addCase(fetchUploadProfileImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUploadProfileImage.fulfilled, (state, action) => {
                state.isLoading = false;
                const blob = action.payload;
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    console.log('Fotoğraf URL45:', url);
                    state.profileImage = url;
                    console.log('state.profileImage: ',state.profileImage);
                }
                
            })
            .addCase(fetchProfileImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProfileImage.fulfilled, (state, action) => {
                state.isLoading = false;
               
                
            })
    },
});


export const { resetError, setProfileImage,clearProfileImage } = fileSlice.actions;
export default fileSlice.reducer;
