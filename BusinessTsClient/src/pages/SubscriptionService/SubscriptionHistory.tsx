import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useTranslation } from 'react-i18next';
import { fetchSubscriptionHistory } from '../../store/feature/subscriptionSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

function SubscriptionHistory() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const subscriptionHistory = useSelector((state: RootState) => state.subscription.subscriptionHistory);
  const language = useSelector((state: RootState) => state.pageSettings.language);
  useEffect(() => {
    dispatch(fetchSubscriptionHistory(language));
  }, [dispatch,language]);

  const handleStatus = (subscription: any) => {
      return t('subscription.' + subscription.status) 
  }
  const handleCancelationDate = (subscription: any) => {
    if(subscription.cancellationDate === null){
      return "-"
    } else {
      return new Date(subscription.cancellationDate).toLocaleDateString()
    }
  }
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {t('subscription.title')}
      </Typography>
      
      {subscriptionHistory.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('subscription.planName')}</TableCell>
                <TableCell>{t('subscription.planDescription')}</TableCell>
                <TableCell>{t('subscription.planPrice')}</TableCell>
                <TableCell>{t('subscription.startDate')}</TableCell>
                <TableCell>{t('subscription.endDate')}</TableCell>
                <TableCell>{t('subscription.status')}</TableCell>
                <TableCell>{t('subscription.cancelationDate')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionHistory.map((subscription) => (
                <TableRow key={subscription.authId}>
                  <TableCell>{subscription.planName}</TableCell>
                  <TableCell>{subscription.planDescription}</TableCell>
                  <TableCell>{subscription.planPrice} $</TableCell>
                  <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{handleStatus(subscription)}</TableCell>
                  <TableCell>{handleCancelationDate(subscription)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>{t('subscription.noData')}</Typography>
      )}
    </Box>
  );
}

export default SubscriptionHistory;
