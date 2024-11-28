import React, { useEffect, useState } from 'react';
import { Typography, Avatar, Container} from '@mui/material';
import tickMarkImage from '../images/tick_mark.jpg'
import { useTranslation } from 'react-i18next';
import { AppDispatch, useAppSelector } from '../store';
import { useDispatch } from 'react-redux';
import { fetchVerifyAccount } from '../store/feature/authSlice';
import { useLocation } from 'react-router-dom';


const VerifyAccount: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
 

  useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const tokenFromUrl = queryParams.get('token');

      console.log("Token from URL: ", tokenFromUrl);

      if (tokenFromUrl) {
          setToken(tokenFromUrl);
          dispatch(fetchVerifyAccount({ token: tokenFromUrl })).then(data => {
              console.log("Response from fetchVerifyAccount: ", data);
              
          });
      }
  }, [dispatch, location.search]);
  



  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
      <Avatar
        alt="Check Picture"
        src={tickMarkImage}
        sx={{ width: 150, height: 150, mb: 2 }}
      />
      <Typography variant="h6" component="div" gutterBottom>
        {t('authentication.accountHasBeenActivated')}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
        {t('authentication.accountGreeting')}
      </Typography>
      
      
    </Container>
  );
};

export default VerifyAccount;
