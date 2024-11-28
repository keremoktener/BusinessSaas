import { Box, Button, Container, Grid, IconButton, styled, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppSelector } from '../store';
import { fetchUpdateUser, fetchUserInformation } from '../store/feature/userSlice';
import { fetchChangeMyPassword, fetchLoginProfileManagement } from '../store/feature/authSlice';
import { deleteFile, fetchFile, fetchProfileImage, fetchUploadProfileImage, uploadFile } from '../store/feature/fileSlice';
import FileUploadProps from '../components/molecules/FileUploadProps';
const ProfileImageWrapper = styled('div')({
  position: 'relative',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  overflow: 'hidden',
  border: '2px solid #ddd',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover .overlay': {
    opacity: 1,
  },
});

const ProfileImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s',
});

const HiddenInput = styled('input')({
  display: 'none',
});

function ProfileManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.userSlice.user);

  // useState ile formdaki değerleri kontrol ediyorsunuz
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uuid = useSelector((state: RootState) => state.fileSlice.uuid);
  
  
  

  useEffect(() => {
      dispatch(fetchUserInformation()).then((data) => {
          if(data.payload.code==200 && data.payload.data){
            dispatch(fetchProfileImage()).then((data) => {
              const blob = data.payload;
              if (blob) {
                const url = URL.createObjectURL(blob);
                console.log('Fotoğraf URL:', url);
                setImageUrl(url);
            }
            });
          }
      });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
    }
  }, [user]); 
  const handleSubmit = (e: React.FormEvent) => {
      dispatch(fetchUpdateUser({authId: user.authId,firstName, lastName, email})).then((data) => {
          if(data.payload.code==200 ){
              alert('Bilgileriniz Güncellendi')
          } else {
            alert(data.payload.message)
          }
      });
  };
  
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
        dispatch(fetchUploadProfileImage(files[0]))
             .catch((error) => {
                console.error("Error uploading file:", error);
            }).then(() => {
              dispatch(fetchProfileImage()).then((data) => {
                const blob = data.payload;
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  console.log('Fotoğraf URL:', url);
                  setImageUrl(url);
              }
              });
            });
    }
};

/* useEffect(() => {
    if (uuid) { 
        dispatch(fetchFile(uuid))
            .unwrap()
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("Error fetching file:", error);
            });
    }
}, [uuid, dispatch]);
 */
  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newPassword!=newConfirmPassword){
      alert('Şifreler uyuşmuyor')
    }
    dispatch(fetchChangeMyPassword({authId: user.authId,newPassword, newConfirmPassword})).then((data) => {
      if(data.payload.code==200 && data.payload.data){
        alert('Şifreniz Başarıyla Değiştirildi')
        setNewPassword('')
        setNewConfirmPassword('')
      } else {
        alert(data.payload.message)
      }
    });
  }
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchLoginProfileManagement({password})).then((data) => {
      if(data.payload.code==200 && data.payload.data){
        setIsAuthenticated(true);
      } else {
        alert('Girdiğiniz Şifre Yanlış')
      }
    });
    
};

  if (!isAuthenticated) {
    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <form onSubmit={handlePasswordSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Şifre"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" color="primary">
                            Profil Bilgilerimi Göster
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    if(file.type === 'application/pdf'){
      alert('PDF dosyaları desteklenmiyor')
      return;
    }
    handleFileUpload([file]);
    
  }
};


  return (
        <>
        
        <Container maxWidth="sm">
          {/* Profil resim işlemi */}
          <Box mt={4} >
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} display="flex" justifyContent="center">
                <ProfileImageWrapper  onClick={() => document.getElementById('profile-image-upload')?.click()}>
                  {imageUrl ? (
                    <ProfileImage src={imageUrl} alt="Profil Resmi" />
                  ) : (
                    <ProfileImage src="https://i.pinimg.com/736x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg" alt="Profil Resmi" />
                  )}
                  <Overlay className="overlay">
                    <span>Değiştir</span>
                  </Overlay>
                </ProfileImageWrapper>
                
                {/* Gizli dosya yükleme input'u */}
                <HiddenInput
                  accept="image/*"
                  id="profile-image-upload"
                  type="file"
                  onChange={handleFileChange}
                />
              </Grid>
            </Grid>
          </Box>

            <Box mt={4}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                 

                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="primary">
                    Profil Bilgilerimi Güncelle
                  </Button>
                </Box>
                
              </form>

              
            </Box>


                    

           
          

            <Box mt={4}>
              <form onSubmit={handleNewPasswordSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Yeni Şifre"
                      variant="outlined"
                      type="password"

                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tekrar Yeni Şifre"
                      type="password"
                      variant="outlined"
                      onChange={(e) => setNewConfirmPassword(e.target.value)}
                    />
                  </Grid>

                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="primary">
                    Şifremi Güncelle
                  </Button>
                </Box>
                
              </form>
            </Box>


        </Container>
        
        
        </>
    );
  
}

export default ProfileManagement;