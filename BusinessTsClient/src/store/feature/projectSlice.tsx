import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import RestApis from "../../config/RestApis.tsx";
import {IListProject} from "../../model/IListProject.tsx";


interface IFetchSaveProject{
    name:string,
    description:string,
    status:string,
}

interface IProjectState {
    projects: IListProject[],
    loading: boolean, // Yüklenme durumu
    error: string | null, // Hata mesajı
}

const initialProjectState :IProjectState  ={
    projects: [],
    loading: false, // Yüklenme durumu
    error: null,
}

export const fetchSaveProject = createAsyncThunk(
    'project/fetchSaveProject',
    async (payload: IFetchSaveProject, { rejectWithValue }) => {
        try {
            const values = {
                name: payload.name,
                description: payload.description,
                status: payload.status
            };

            const result = await axios.post(
                RestApis.project_management_service + "/save-project",
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('token')
                    }
                }
            );
            return result.data;
        } catch (error: any) {
            if (error.response) {
                // Sunucu yanıtı ile gelen hatayı burada yakalayabiliriz
                console.error("API Error Response:", error.response.data);
                return rejectWithValue(error.response.data);
            } else {
                // Sunucuya ulaşamama gibi durumlar
                console.error("Unknown Error:", error.message);
                return rejectWithValue(error.message);
            }
        }
    }
);


export const fetchFindAllProject = createAsyncThunk(
    'project/fetchProjectList',
    async () => {

        const result = await axios.get(
            RestApis.project_management_service + "/findall",
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

export const fetchDeleteProject = createAsyncThunk(
    'project/fetchDeleteProject',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.project_management_service + "/" + id,
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

const projectSlice = createSlice({
    name: 'project',
    initialState: initialProjectState,
    reducers: {
      deleteProjectFromList:(state,action)=>{
          state.projects = state.projects.filter(project=>project.id!==action.payload)
      }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFindAllProject.pending, (state) => {
                state.loading = true; // Yükleniyor durumu aç
                state.error = null; // Hata durumunu sıfırla
            })
            .addCase(fetchFindAllProject.fulfilled, (state, action) => {
                state.loading = false; // Yükleniyor durumu kapat
                state.projects = action.payload; // Alınan projeleri state'e ekle
            })
            .addCase(fetchFindAllProject.rejected, (state, action) => {
                state.loading = false; // Yükleniyor durumu kapat
                state.error = action.error.message  || null; // Hata mesajını ekle
            })
            .addCase(fetchDeleteProject.fulfilled,
                (state, action) =>
                {
                    state.projects=state.projects.filter(project => project.id!==action.meta.arg)
                });

    },
});

export default projectSlice.reducer
export const {deleteProjectFromList}=projectSlice.actions
