import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Button, Paper} from "@mui/material";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {deleteProjectFromList, fetchDeleteProject, fetchFindAllProject} from "../../store/feature/projectSlice.tsx";
import {AppDispatch, useAppSelector} from "../../store";
import {NavLink} from "react-router-dom";
import Swal from "sweetalert2";

const ListProjectPage = ()=>
{
    const dispatch= useDispatch<AppDispatch>();
    const rows = useAppSelector((state)=> state.projectSlice.projects);


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'id', width: 70 },
        { field: 'name', headerName: 'name', width: 130 },
        { field: 'description', headerName: 'description', width: 130 },
        {
            field: 'status',
            headerName: 'status',
            type: 'number',
            width: 90,
        },
        {
            field: 'action',
            headerName: 'action',
            sortable:false,
            width: 160,
            renderCell:(params)=>(
                <Button onClick={()=> handleDelete(params.row.id)}
                        style={{backgroundColor:'red',color:'white'}}>delete</Button>
            )
        },
    ];

    useEffect(() => {
        dispatch(fetchFindAllProject());
    }, [dispatch]);

    const paginationModel = { page: 0, pageSize: 5 };

    const handleDelete=  async (id)=>{
        const result = await Swal.fire({
            title:"Are you sure?",
            text:"You are about to delete this project!",
            icon:'warning',
            showCancelButton:true,
            confirmButtonColor:'primary',
            cancelButtonColor:'secondary',
            confirmButtonText:'Delete'
        });
        if(result.isConfirmed){
            try {
                await dispatch(fetchDeleteProject(id));
                Swal.fire('Deleted','Project has been deleted successfully','success');

                dispatch(deleteProjectFromList(id))
            }catch (error){
                Swal.fire('Error!','The project could not be deleted','error');
            }
        }
    }

        return (
            <>
                <NavLink to="/create-project">
                    <Button>Create new Project</Button>
                </NavLink>

            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
            </>
        );
}

export default ListProjectPage;