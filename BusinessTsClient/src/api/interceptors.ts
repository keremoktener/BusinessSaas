import axios from 'axios';
import { AppDispatch } from '../store';
import { fetchCheckSubscription } from '../store/feature/subscriptionSlice';
import { fetchUserRoles } from '../store/feature/userSlice';
import { NavigateFunction } from 'react-router-dom';

// Create an Axios instance
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set up interceptors with dispatch and navigate
export const setupInterceptors = (dispatch: AppDispatch, navigate: NavigateFunction) => {
  apiClient.interceptors.request.use(async (config) => {
    try {
      // Dispatch subscription and user role checks before the request
      await dispatch(fetchCheckSubscription()).unwrap();
      await dispatch(fetchUserRoles()).unwrap();

      return config;
    } catch (error) {
      // If there's an issue with checking the subscription or roles, navigate to the subscription page
      navigate("/subscription");
      return Promise.reject(error); // Reject the request if subscription check or role fetch fails
    }
  }, (error) => {
    navigate("/subscription");
    return Promise.reject(error);
  });
};

export default apiClient;
