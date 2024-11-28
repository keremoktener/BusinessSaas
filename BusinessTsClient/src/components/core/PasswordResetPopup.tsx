import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Avatar, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { useTranslation } from 'react-i18next';
import { fetchForgotPassword } from '../../store/feature/authSlice';

const PasswordResetPopup: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');




  const handleSend = () => {
    dispatch(fetchForgotPassword({ email: email }));
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="password-reset-modal"
      aria-describedby="password-reset-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 420,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '15px'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.primary'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Avatar
          sx={{
            m: 1,
            bgcolor: 'grey.500',
            width: 100,
            height: 100,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Typography variant="h6" component="h2">
          {t('swal.updatePassword')}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t('swal.infoForPasswordReset')}
        </Typography>
        <TextField
          fullWidth
          label="E-posta adresiniz"
          variant="outlined"
          sx={{ mt: 2 }}
          value={email}
          onChange={(evt)=> setEmail(evt.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: '#002244', color: 'white', textTransform: 'none' }}
          onClick={handleSend}
        >
          <Typography component="h1" variant="h6">
            {t('swal.send')}
          </Typography>
        </Button>
      </Box>
    </Modal>
  );
};

export default PasswordResetPopup;
