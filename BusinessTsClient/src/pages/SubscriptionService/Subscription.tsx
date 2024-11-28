import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { AppDispatch, RootState } from '../../store';
import { fetchCheckSubscription, fetchFindAllActiveSubscriptionPlans, fetchFindAllPlans, fetchSubscribe, fetchUnsubscribe } from '../../store/feature/subscriptionSlice';
import { useTranslation } from 'react-i18next';
import { fetchUserRoles } from '../../store/feature/userSlice';
import Swal from 'sweetalert2';
import { IPlan } from '../../model/IPlan';

/**
 * Subscription component displays available subscription plans and allows the user to subscribe or unsubscribe.
 * It fetches the subscription plans, user roles, and active subscriptions, and manages the subscription actions.
 */
const Subscription: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const plans = useSelector((state: RootState) => state.subscription.planList);
  const userRoles = useSelector((state: RootState) => state.userSlice.userRoleList);
  const activeSubscriptionRoles = useSelector((state: RootState) => state.subscription.activeSubscriptionRoles);
  const language = useSelector((state: RootState) => state.pageSettings.language);
  const activeSubscriptionPlans = useSelector((state: RootState) => state.subscription.activeSubscriptionPlans);
  /**
   * Function to dispatch actions that fetch data for subscriptions and user roles.
   */
  const fetchData = () => {
    dispatch(fetchCheckSubscription());
    dispatch(fetchFindAllPlans());
    dispatch(fetchUserRoles());
    dispatch(fetchFindAllActiveSubscriptionPlans());
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [dispatch,language]);

  /**
   * Handles subscription or unsubscription based on the current status.
   * If the user is subscribed, they are prompted with a confirmation before unsubscribing.
   * If not subscribed, the user is subscribed directly.
   *
   * @param {number} planId - The ID of the plan to subscribe or unsubscribe.
   * @param {boolean} isSubscribed - Indicates if the user is currently subscribed to the plan.
   */
  const handleSubscription = (planId: number, isSubscribed: boolean) => {
    if (isSubscribed) {
      // Confirmation prompt for unsubscribing
      Swal.fire(t('swal.areyousure'), t('swal.unsubscribe'), 'warning').then(() => {
        console.log(planId, isSubscribed);
        dispatch(fetchUnsubscribe(planId))
          .then(() => {
            fetchData();
          });
      });
    } else {
      // Subscribe to the plan
      dispatch(fetchSubscribe({ planId, subscriptionType: 'MONTHLY' }))
        .then(() => {
          fetchData();
        });
    }
  };


  /**
   * Checks if a subscription for a given plan name exists by comparing with active subscription roles.
   * 
   * @param {string} planName - The name of the subscription plan.
   * @returns {boolean} - True if the user is subscribed to the plan, otherwise false.
   */
  const checkSubscriptions = (planId: number) => {
    return activeSubscriptionPlans.map((plan) => plan.id).includes(planId);
  };

  return (
    <Grid container spacing={3} padding={3}>
      {plans.map((plan) => (
        <Grid 
          item 
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={plan.id} 
          sx={{ display: 'flex', alignItems: 'stretch' }}
        >
          <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {plan.translations.find((translation) => translation.language === language)?.name || 'Unknown'}
              </Typography>
              <Typography variant="h6" color="text.primary" sx={{ marginTop: 2 }}>
                ${plan.price}/month
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color={checkSubscriptions(plan.id) ? 'error' : 'success'}
                onClick={() => handleSubscription(plan.id, checkSubscriptions(plan.id))}
              >
                {checkSubscriptions(plan.id) ? t('subscription.unsubscribe') : t('subscription.subscribe')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Subscription;
