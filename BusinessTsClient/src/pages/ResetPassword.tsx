import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Box, Avatar } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchResetPassword } from '../store/feature/authSlice';
import Swal from 'sweetalert2';

const ResetPassword: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setrePassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        setToken(tokenFromUrl || '' );
    }, [location.search]);


    const sendNewPassword = () => {
        if(token){
            dispatch(fetchResetPassword({ token:token, newPassword:newPassword, rePassword:rePassword })).then(data => {
              if (data.payload.code === 200) {
                Swal.fire(t('swal.success'), t('swal.passwordSuccesfullyChanged'), "success")
                .then(() => navigate('/login'))
                
              } else {
                Swal.fire(t('swal.error'), t('swal.failedChangePassword'), "error");
              }
            });
        }
        
      
    };
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== rePassword) {
      setError(t('authentication.passwordMismatch'));
    } else {
      setError(null);
      sendNewPassword(); 
      
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: 'grey.500', 
            width: 100, 
            height: 100, 
            mb: 2
          }}
        >
          <LockOpenIcon sx={{ fontSize: 50 }} /> 
        </Avatar>
        <Typography component="h1" variant="h4">
          {t('authentication.resetPassword')}
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label={t('authentication.newPassword')}
            name="password"
            type="password"
            autoComplete="current-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!error}
            helperText={error && t('authentication.passwordMismatch')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirm-password"
            label={t('authentication.reEnterNewPassword')}
            name="confirm-password"
            type="password"
            autoComplete="current-password"
            value={rePassword}
            onChange={(e) => setrePassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#002244', 
                color: 'white', textTransform: 'none' }}
                onClick={sendNewPassword}
          >
           <Typography component="h1" variant="h6">
          {t('swal.send')}
        </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;