import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useTranslation } from 'react-i18next';
import { Root } from '../components/core/Root';
import { fetchLogin } from '../store/feature/authSlice';
import { fetchUserRoles } from '../store/feature/userSlice';
import Swal from 'sweetalert2';
import PasswordResetPopup from '../components/core/PasswordResetPopup';
import { fetchCheckSubscription } from '../store/feature/subscriptionSlice';
import { fetchProfileImage, setProfileImage } from '../store/feature/fileSlice';

export function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({
        email: false,
        password: false,
    });

    const [passwordResetOpen, setPasswordResetOpen] = useState(false);

    const handleSignUp = () => {
        navigate('/register');
    }

    const handleOpenPasswordReset = () => setPasswordResetOpen(true);
    const handleClosePasswordReset = () => setPasswordResetOpen(false);

    const validateForm = () => {
        const newError = {
            email: !email,
            password: !password,
        };
        setError(newError);

       
        if (newError.email || newError.password) {
            Swal.fire(t('authentication.error'), t('authentication.fillAllFields'), "error");
            return false;
        }

        return true;
    }

    const handleLogin = () => {
        if (validateForm()) {
            dispatch(fetchLogin({ email, password })).then((data) => {
                // TODO: Add subscription check
                if (data.payload.code === 200) {
                    localStorage.setItem('token', data.payload.data);
                    dispatch(fetchCheckSubscription()).then(() => {
                        dispatch(fetchUserRoles()).then((rolesData) => {
                            const roles = rolesData.payload.data;
                        
                            // Check if the only role is 'MEMBER'
                            if (roles.length === 1 && roles[0] === 'MEMBER') {
                                navigate('/subscription');
                            } else if (roles.includes('SUPER_ADMIN')) {
                                navigate('/admin-dashboard');
                            } else if (roles.includes('MEMBER')) {
                                navigate('/member-dashboard');
                            } else if (roles.includes('SUPPLIER')) {
                                navigate('/supplier-orders');
                            }
                            else if (roles.includes('SUPPORTER')) {
                                navigate('/supporter-dashboard');
                            }
                        }).then(() => {
                            dispatch(fetchProfileImage()).then((data) => {
                                const blob = data.payload;
                                  if (blob) {
                                    const url = URL.createObjectURL(blob);                                
                                    dispatch(setProfileImage(url));
                                }
                            })
                        });
                    })    
                } else {
                    Swal.fire(t('authentication.error'), data.payload.message || t('authentication.loginFailed'), 'error');
                }
            }).catch((error) => {
                Swal.fire(t('authentication.error'), t('authentication.errorOccurred'), 'error');
            });
        }
    };

    return (
        <Root sx={{ backgroundColor: '#F0EBE3' }}>
            <Box display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ p: 2, backgroundColor: '#F0EBE3', width: '100%' }}>
                <Card sx={{ width: 400, maxWidth: '90%', minHeight: 400, mx: 'auto', mt: 10, borderRadius: 3, backgroundColor: '#F5F7F8', boxShadow: '2px 0px 22px 0px rgba(0,0,0,0.46)' }}>
                    <CardContent>
                        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
                            <Typography variant="h5">{t('navigation.login')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Don’t have an account?
                                <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleSignUp}>
                                    {t('navigation.register')}
                                </Link>
                            </Typography>
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <TextField
                                fullWidth
                                name="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={error.email}
                                helperText={error.email && t('authentication.requiredField')}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    }
                                }}
                            />

                            <Link variant="body2" color="inherit" sx={{ mb: 1.5 }} onClick={handleOpenPasswordReset}>
                                Forgot password?
                            </Link>

                            <TextField
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={error.password}
                                helperText={error.password && t('authentication.requiredField')}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                <Icon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    }
                                }}
                            />

                            <LoadingButton
                                fullWidth
                                size="large"
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleLogin}
                                sx={{
                                    textTransform: 'none',
                                    bgcolor: '#002244',
                                    borderRadius: 3,
                                    marginTop: 3
                                }}
                            >
                                {t('navigation.login')}
                            </LoadingButton>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <PasswordResetPopup open={passwordResetOpen} onClose={handleClosePasswordReset} />
        </Root>
    );
}

export default Login;
