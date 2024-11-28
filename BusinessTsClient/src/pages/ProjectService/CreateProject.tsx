import {Box, Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useState} from "react";
import Swal from "sweetalert2";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {fetchSaveProject} from "../../store/feature/projectSlice.tsx";

const CreateProjectPage = ()=> {

    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const handleSaveProject = () => {

        dispatch(fetchSaveProject({
            name: name,
            description: description,
            status: status,
        })).then((data) => {
            console.log("Api Response",data)
            console.log("Payload",data?.payload)
               if(fetchSaveProject.fulfilled.match(data)) {
                   setName('');
                   setDescription('');
                   setStatus('');
                   Swal.fire({
                       title: "Success",
                       text: "Project saved successfully",
                       icon: "success",
                       confirmButtonText: "OK"
                   })
               }else{
                   Swal.fire({
                       title: "Error",
                       text:  "An error occured while saving the project",
                       icon: "error",
                   });
               }
        }).catch((error) => {
            Swal.fire({
                title: "Error",
                text: "An error occured while saving the project",
                icon: "error",
            });
            console.log(error);
        });
    }

   return (
       <Box sx={{ width: 500, maxWidth: '100%' }}>
          <div>
              <TextField fullWidth label="name" id="name" name={'name'}
                           value={name}
                           onChange={(e)=> setName(e.target.value)}
                           sx={{ mb: 2 }}  /></div>
          <div>
              <TextField fullWidth label="description"
                         id="description"
                         name={'description'}
                         value={description}
                         onChange={(e)=>setDescription(e.target.value)}
                         sx={{ mb: 2 }}  /></div>

          <div>
              <TextField fullWidth label="status"
                         id="status"
                         name={'status'}
                         value={status}
                         onChange={(e)=>setStatus(e.target.value)}
                         sx={{ mb: 2 }} />
          </div>
           <Button onClick={()=>{
              handleSaveProject()
           }} sx={{marginLeft:'30em'}}>Save</Button>
       </Box>
   );
}

export default CreateProjectPage;