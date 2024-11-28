import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  Switch,
  Tooltip,
  Box,
  Pagination,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { fetchRoleList, fetchSaveRole, fetchUpdateRole, fetchUpdateUserRoleStatus } from '../../store/feature/roleSlice';
import { IRole } from '../../model/IRole';
import { AppDispatch, useAppSelector } from '../../store';
import { IPagableRoleList } from '../../model/IPagableRoleList';

function ManageRoles() {
  const [openNewRoleDialog, setOpenNewRoleDialog] = useState(false);
  const [openEditRoleDialog, setOpenEditRoleDialog] = useState(false); 
  const [newRole, setNewRole] = useState({
    roleName: '',
    roleDescription: '',
  });
  const [editRole, setEditRole] = useState<IRole | null>(null); 
  const [searchWord, setSerchWord] = useState(''); 
  const dispatch = useDispatch<AppDispatch>();
  const roleList: IRole[] = useAppSelector((state) => state.roleSlice.roleList);
  const [currentPage, setCurrentPage] = useState(0);  
  const [totalPages, setTotalPages] = useState(1);  
  const [totalElements, setTotalElements] = useState(0); 
  const [pageSize, setPageSize] = useState(5);  
  const [pageableRoleList, setPageableRoleList] = useState<IRole[]>([]);

  useEffect(() => {
    dispatch(fetchRoleList({searchText:searchWord, page: currentPage, size: pageSize})).then((data) => {
      if(data.payload.code === 200) {
        const roleData: IPagableRoleList = data.payload.data;
        setTotalPages(roleData.totalPages);
        setTotalElements(roleData.totalElements);
        setPageableRoleList(roleData.roleList);
        setTotalElements(roleData.totalElements);
      }
    });
  }, [dispatch, currentPage, pageSize, searchWord]);

  const handleOpenNewRoleDialog = () => {
    setOpenNewRoleDialog(true);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCloseNewRoleDialog = () => {
    setOpenNewRoleDialog(false);
    setNewRole({
      roleName: '',
      roleDescription: '',
    });
  };

  const handleOpenEditRoleDialog = (role: IRole) => {
    setEditRole(role); 
    setOpenEditRoleDialog(true);
  };

  const handleCloseEditRoleDialog = () => {
    setOpenEditRoleDialog(false);
    setEditRole(null);
  };

  const handleSaveNewRole = () => {
    dispatch(fetchSaveRole(newRole)).then((data) => {
      if (data.payload.code === 200) {
        dispatch(fetchRoleList({serchText:searchWord, page: currentPage, size: pageSize})).then((data) => {
          if(data.payload.code === 200) {
            const roleData: IPagableRoleList = data.payload.data;
            setTotalPages(roleData.totalPages);
            setTotalElements(roleData.totalElements);
            setPageableRoleList(roleData.roleList);
          }
        });
      }
    });
    handleCloseNewRoleDialog();
  };

  const handleUpdateRole = () => {
    if (editRole) {
      const updatedRole = {
        ...editRole,
        roleId: editRole.roleId,
        roleName: editRole.roleName,
        roleDescription: editRole.roleDescription,
      };
      console.log(updatedRole);
      dispatch(fetchUpdateRole({roleId: updatedRole.roleId, roleName: updatedRole.roleName, roleDescription: updatedRole.roleDescription})).then((data) => {
        if (data.payload.code === 200) {
          dispatch(fetchRoleList({serchText:searchWord,page: currentPage, size: pageSize})).then((data) => {
            if(data.payload.code === 200) {
              const roleData: IPagableRoleList = data.payload.data;
              setTotalPages(roleData.totalPages);
              setTotalElements(roleData.totalElements);
              setPageableRoleList(roleData.roleList);
            }
          });
        }
      });
      handleCloseEditRoleDialog();
    }
  };
  const handleStatusChange = (role: IRole) => {
    if (role.status === 'ACTIVE') {
       dispatch(fetchUpdateUserRoleStatus({ roleId: role.roleId, status: 'INACTIVE' })).then((data) => {
         if (data.payload.code === 200) {
          dispatch(fetchRoleList({serchText:searchWord,page: currentPage, size: pageSize})).then((data) => {
            if(data.payload.code === 200) {
              const roleData: IPagableRoleList = data.payload.data;
              setTotalPages(roleData.totalPages);
              setTotalElements(roleData.totalElements);
              setPageableRoleList(roleData.roleList);
            }
          });
         }
       })
    } else {
       dispatch(fetchUpdateUserRoleStatus({ roleId: role.roleId, status: 'ACTIVE' })).then((data) => {
         if (data.payload.code === 200) {
          dispatch(fetchRoleList({serchText:searchWord,page: currentPage, size: pageSize})).then((data) => {
            if(data.payload.code === 200) {
              const roleData: IPagableRoleList = data.payload.data;
              setTotalPages(roleData.totalPages);
              setTotalElements(roleData.totalElements);
              setPageableRoleList(roleData.roleList);
            }
          });
         }
       })
    }
    
  };

  
  

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenNewRoleDialog} sx={{ marginBottom: '10px' }}>
        Yeni Rol Ekle
      </Button>

      
      <TextField
        label="Rol ismine göre ara"
        variant="outlined"
        value={searchWord}
        onChange={(e) => setSerchWord(e.target.value)}
        fullWidth
        sx={{ marginBottom: '10px' }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Rol İsmi</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Rol Açıklaması</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Rol Durumu</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Eylemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageableRoleList.map((role, index) => (
              <TableRow key={role.roleId}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                  '&:hover': { backgroundColor: 'primary.light' },
                }}
              >
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{role.roleName}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{role.roleDescription}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{role.status}
                <Tooltip title={role.status === 'ACTIVE' ? 'Rolü Pasifleştir ' : 'Rolü Aktifleştir'} arrow>
                      <Switch
                        checked={role.status === 'ACTIVE'}
                        onChange={() => handleStatusChange(role)}
                        color="success"
                      />
                    </Tooltip>
                </TableCell>
                
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  <Tooltip title="Düzenle" arrow>
                    <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                      <Button variant="contained" color="secondary" onClick={() => handleOpenEditRoleDialog(role)} sx={{ marginLeft: '5px' }} startIcon={<EditIcon sx={{ marginLeft: '12px' }} />}>
                      </Button>
                    </Box>      
                  </Tooltip>                    
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage + 1} // Pagination component 1-indexed çalışıyor
          onChange={(event, value) => handlePageChange(value - 1)}  // 0-indexed için ayar
          color="primary"
        />
        <FormControl variant="outlined" sx={{ marginBottom: 2 }}>
            <Select 
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0); // Sayfa boyutu değiştiğinde ilk sayfaya dön
              }}
            >
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
      </Box>

      {/* Yeni Rol Ekleme  */}
      <Dialog open={openNewRoleDialog} onClose={handleCloseNewRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Rol Ekle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Rol İsmi"
              variant="outlined"
              value={newRole.roleName}
              onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Rol Açıklaması"
              variant="outlined"
              value={newRole.roleDescription}
              onChange={(e) => setNewRole({ ...newRole, roleDescription: e.target.value })}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewRoleDialog} color="secondary">Kapat</Button>
          <Button onClick={handleSaveNewRole} color="primary">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Rol Düzenleme */}
      <Dialog open={openEditRoleDialog} onClose={handleCloseEditRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle >Rol Düzenle</DialogTitle>
        <DialogContent>
          {editRole && (
            <>
              <FormControl fullWidth sx={{marginTop: 2, marginBottom: 2 }}>
                <TextField
                  label="Rol İsmi"
                  variant="outlined"
                  value={editRole.roleName}
                  onChange={(e) => setEditRole({ ...editRole, roleName: e.target.value })}
                />
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <TextField
                  label="Rol Açıklaması"
                  variant="outlined"
                  value={editRole.roleDescription}
                  onChange={(e) => setEditRole({ ...editRole, roleDescription: e.target.value })}
                />
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditRoleDialog} color="secondary">Kapat</Button>
          <Button onClick={handleUpdateRole} color="primary">Güncelle</Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}

export default ManageRoles;
