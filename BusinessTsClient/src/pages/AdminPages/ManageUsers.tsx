import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  ListItemText,
  ListItem,
  List,
  Tooltip,
  ListItemButton,
  FormControl,
  Switch,
  Box,
  Pagination,
  MenuItem,
  Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { AppDispatch, useAppSelector } from '../../store';
import { useDispatch } from 'react-redux';
import { fetchAddRoleToUser, fetchChangeUserEmail, fetchChangeUserPassword, fetchGetAllUsersPageable, fetchSaveUser, fetchUpdateUserStatus, fetchUserList } from '../../store/feature/userSlice';
import { IUser } from '../../model/IUser';
import { IRole } from '../../model/IRole';
import { fetchAsiggableRoleList } from '../../store/feature/roleSlice';
import { GroupAdd } from '@mui/icons-material';
import { IPageableUserList } from '../../model/IPageableUserList';
import Swal from 'sweetalert2';

function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
  const [newEmail, setNewEmail] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const userList: IUser[] = useAppSelector((state) => state.userSlice.userList);
  const [userListPageable, setUserListPageable] = useState<IUser[]>([]);
  const availableRoles: IRole[] = useAppSelector((state) => state.roleSlice.assigableRoleList);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1); 
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleIds: [] || null
  });
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize })).then((data) => {
      if (data.payload.code === 200) {
        const userData: IPageableUserList = data.payload.data;
        setTotalPages(userData.totalPages);
        setTotalElements(userData.totalElements);
        setUserListPageable(userData.userList);
        console.log('userListPageable : ',userData);
      }
    });
  }, [dispatch, currentPage, pageSize,searchTerm]);



  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOpenDialog = (userId: number) => {
    dispatch(fetchAsiggableRoleList(userId)).then((data) => {
      if (data.payload.code === 200) {
        console.log(data.payload.data);
      }
    });
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(0);
    setSelectedRoleId(null);
  };

  const handleOpenConfirmationDialog = (roleId: number) => {
    setSelectedRoleId(roleId);
    setOpenConfirmationDialog(true);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
    setSelectedRoleId(null);
  };

  const handleAddRole = () => {
    if (selectedRoleId !== null) {
      dispatch(fetchAddRoleToUser({ userId: selectedUserId, roleId: selectedRoleId })).then((data) => {
        if (data.payload.code === 200) {
          dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize })).then((data) => {
            if (data.payload.code === 200) {
              const userData: IPageableUserList = data.payload.data;
              setTotalPages(userData.totalPages);
              setTotalElements(userData.totalElements);
              setUserListPageable(userData.userList);
            }
          })
        }
      });
    }
    handleCloseDialog();
    handleCloseConfirmationDialog();
  };

  const handleOpenEditDialog = (user: IUser) => {
    setSelectedUserId(user.id);
    setNewEmail(user.email); 
    setOpenEditDialog(true); 
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUserId(0);
    setNewEmail('');
  };

  const handleEditEmail = () => {
    dispatch(fetchChangeUserEmail({ id: selectedUserId, email: newEmail })).then((data) => {
      if (data.payload.message === 'success') {
        dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize })).then((data) => {
          if (data.payload.code === 200) {
            const userData: IPageableUserList = data.payload.data;
            setTotalPages(userData.totalPages);
            setTotalElements(userData.totalElements);
            setUserListPageable(userData.userList);
          }
        })
      } else {
        alert(data.payload.message);
      }
    });
    handleCloseEditDialog(); 
  };

  const handleEditPassword = () => {
    dispatch(fetchChangeUserPassword({ userId: selectedUserId})).then((data) => {
      if (data.payload.code === 200) {
        alert(data.payload.message);
        dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize })).then((data) => {
          if (data.payload.code === 200) {
            const userData: IPageableUserList = data.payload.data;
            setTotalPages(userData.totalPages);
            setTotalElements(userData.totalElements);
            setUserListPageable(userData.userList);
          }
        })
        setNewPassword('');
      }
    })
    handleCloseEditDialog(); 
  };

  const handleStatusChange = (user: IUser) => {
    if (user.status === 'ACTIVE') {
        dispatch(fetchUpdateUserStatus({ userId: user.id, status: 'INACTIVE' })).then((data) => {
            if (data.payload.code === 200) {
              dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize })).then((data) => {
                if (data.payload.code === 200) {
                  const userData: IPageableUserList = data.payload.data;
                  setTotalPages(userData.totalPages);
                  setTotalElements(userData.totalElements);
                  setUserListPageable(userData.userList);
                }
              })
            }
        });
    } else {
        dispatch(fetchUpdateUserStatus({ userId: user.id, status: 'ACTIVE' })).then((data) => {
            if (data.payload.code === 200) {
              dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize })).then((data) => {
                if (data.payload.code === 200) {
                  const userData: IPageableUserList = data.payload.data;
                  setTotalPages(userData.totalPages);
                  setTotalElements(userData.totalElements);
                  setUserListPageable(userData.userList);
                }
              })
            }
        });
    }
    
  };
  const handleOpenNewUserDialog = () => {
    setOpenNewUserDialog(true);
  };
  const handleCloseNewUserDialog = () => {
    setOpenNewUserDialog(false);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleIds: []
    });
  };
  const handleSaveNewUser = () => {
    console.log(newUser);
    dispatch(fetchSaveUser(newUser)).then((data) => {
      if (data.payload.code === 200) {
        dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize })).then((data) => {
          if (data.payload.code === 200) {
            const userData: IPageableUserList = data.payload.data;
            setTotalPages(userData.totalPages);
            setTotalElements(userData.totalElements);
            setUserListPageable(userData.userList);
          }
        })
      }
    });
    handleCloseNewUserDialog();
  };

  return (
    <div>
      <TextField
        label="Soy isme göre ara"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleOpenNewUserDialog} sx={{ marginBottom: '10px' }} >
        Yeni Kullanıcı Ekle
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>İsim</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Soy isim</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>E-posta</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Kullanıcı Durumu</TableCell>              
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Roller</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Eylemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userListPageable.map((user, index) => (
              <TableRow key={user.id}
              sx={{
                backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper', // Alternatif satır rengi
                '&:hover': {
                  backgroundColor: 'primary.light', // Hover efekti
                },
              }}
              >
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.firstName}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.lastName}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.email}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.status}
                <Tooltip title={user.status === 'ACTIVE' ? 'Kullanıcıyı Pasifleştir' : 'Kullanıcıyı Aktifleştir'}   arrow>
                      <Switch 
                        checked={user.status === 'ACTIVE'}
                        onChange={() => handleStatusChange(user)}
                        color="success"
                      />
                    </Tooltip>
                </TableCell>                
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{user.userRoles.join(', ')}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                    <Tooltip title="Rol Ekle" arrow>
                      <Button 
                        variant="contained" 
                        color="primary"  
                        onClick={() => handleOpenDialog(user.id)}                   
                        startIcon={<GroupAdd sx={{ marginLeft: '12px' }} />}
                      >                    
                      </Button>
                    </Tooltip>

                    <Tooltip title="Düzenle" arrow>
                      <Button 
                        sx={{ marginLeft: '5px' }}
                        variant="contained" 
                        color="secondary"                    
                        startIcon={<EditIcon sx={{ marginLeft: '12px' }} />}
                        onClick={() => handleOpenEditDialog(user)} 
                      >
                      </Button>
                    </Tooltip> 
                  </Box>                 
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

      {/* Rol Ekleme Pop-up  */}
      <Dialog open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm" 
        fullWidth 
      >
        <DialogTitle>Rol Ekle</DialogTitle>
        <DialogContent>
          <List>
            {availableRoles.map((role) => (
              <ListItem key={role.roleId}>
                <Tooltip title={role.roleDescription} placement="right">
                  <ListItemButton onClick={() => handleOpenConfirmationDialog(role.roleId)}>
                    <ListItemText 
                      primary={role.roleName} 
                      secondary={role.roleDescription ? role.roleDescription.slice(0, 75) : 'No description available'} 
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Çık</Button>
        </DialogActions>
      </Dialog>

      {/* Onay Diyaloğu */}
      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Onay</DialogTitle>
        <DialogContent>
          <p>Bu rolü eklemek istediğinize emin misiniz?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="secondary">Hayır</Button>
          <Button onClick={handleAddRole} color="primary">Evet</Button>
        </DialogActions>
      </Dialog>

        {/* Düzenleme Diyaloğu */}
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseEditDialog} 
          maxWidth="sm" 
          fullWidth 
        >
          <DialogTitle >Kullanıcıyı Düzenle</DialogTitle>
            <DialogContent >
              <FormControl fullWidth sx={{ marginTop: 2  }}>
                  <TextField
                    label="Yeni E-posta"
                    variant="outlined"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)} 
                  />
                  <Button variant='contained' onClick={handleEditEmail} color="primary" sx={{ marginTop: 2 }}>Yeni Maili Kaydet</Button>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                  <Button variant='contained' onClick={handleEditPassword} color="secondary">Yeni Şifre Gönder</Button>
                </FormControl>
            </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">Kapat</Button>
          </DialogActions>
        </Dialog>
         
         
         
         {/* Yeni Kullanıcı Ekleme  */}
      <Dialog open={openNewUserDialog} onClose={handleCloseNewUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
            <TextField
              label="Ad"
              variant="outlined"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Soyad"
              variant="outlined"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="E-posta"
              variant="outlined"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Şifre"
              type="password"
              variant="outlined"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewUserDialog} color="secondary">Kapat</Button>
          <Button onClick={handleSaveNewUser} color="primary">Kaydet</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageUsers;


