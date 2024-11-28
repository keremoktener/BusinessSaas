import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { fetchRegister } from '../store/feature/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";
import { Root } from '../components/core/Root';



function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

 
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    rePassword: false,
  });

  const handleSignUp = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const register = () => {
   
    const newErrorState = {
      firstName: firstName === '',
      lastName: lastName === '',
      email: email === '',
      password: password === '',
      rePassword: rePassword === '',
    };
    setError(newErrorState);

    
    if (Object.values(newErrorState).some((field) => field)) {
      Swal.fire(t('authentication.error'), t('authentication.fillAllFields'), "error");
      return;
    }

    
    if (!validateEmail(email)) {
      Swal.fire(t('authentication.error'), t('authentication.invalidEmail'), "error");
      return;
    }

    
    if (password !== rePassword) {
      Swal.fire(t('authentication.error'), t('authentication.passwordMismatch'), "error");
      return;
    }

  
    dispatch(fetchRegister({
      firstName, lastName, email, password, rePassword
    })).then(data => {
      if (data.payload.code === 200) {
        Swal.fire(t('authentication.successful'), t('authentication.registrationSuccessful'), "success");
        navigate('/login');
      } else {
        Swal.fire(t('authentication.error'), data.payload.message, "error");
      }
    });
  }

  return (
    <Root sx={{ backgroundColor: '#F0EBE3' }}>
<Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{  p: 8, backgroundColor: '#F0EBE3', width: '100%', }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 3, backgroundColor: '#F5F7F8', boxShadow: '2px 0px 22px 0px rgba(0,0,0,0.46)' ,maxHeight:'90vh' }}>
        <CardContent>
          <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5, mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#002244' }}>{t('authentication.createAccount')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('authentication.alreadyHaveAnAccount')}
              <Link variant="subtitle2" sx={{ ml: 0.5, fontWeight: 'bold' }} onClick={handleSignUp}>
                {t('navigation.login')}
              </Link>
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <TextField
              fullWidth
              label={t('authentication.name')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={error.firstName}
              helperText={error.firstName && t('authentication.requiredField')}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
            />
            <TextField
              fullWidth
              label={t('authentication.surname')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={error.lastName}
              helperText={error.lastName && t('authentication.requiredField')}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
            />
            <TextField
              fullWidth
              label={t('authentication.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error.email}
              helperText={error.email && t('authentication.requiredField')}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
            />
            <TextField
              fullWidth
              label={t('authentication.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error.password}
              helperText={error.password && t('authentication.requiredField')}
              type={showPassword ? 'text' : 'password'}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Icon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('authentication.rePassword')}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              error={error.rePassword}
              helperText={error.rePassword && t('authentication.requiredField')}
              type={showRePassword ? 'text' : 'password'}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowRePassword(!showRePassword)} edge="end">
                      <Icon icon={showRePassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="button"
              color="primary"
              variant="contained"
              onClick={register}
              sx={{
                textTransform: 'none',
                bgcolor: '#002244',
                borderRadius: 3
              }}
            >
              {t('navigation.register')}
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
    </Root>
    
  );
}

export default Register;
