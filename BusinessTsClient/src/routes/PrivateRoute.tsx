import React from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface PrivateRouteProps {
  element: React.ReactNode;
  roles?: string[]; // Optional array of roles
}

/**
 * PrivateRoute component that protects routes based on authentication and user roles.
 *
 * This component checks if a user is authenticated by verifying the presence of a token.
 * It also checks if the user's role is included in the allowed roles. If not authenticated
 * or if the role is not permitted, the user is redirected to the login page.
 *
 * @param {PrivateRouteProps} props - The component props.
 * @returns {React.ReactNode} - Returns the element if authenticated and authorized; otherwise, redirects to the login page.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRoleList');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If no user role, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Parse userRole if it's stored as a JSON array, otherwise convert to an array
  let userRolesArray: string[] = [];
  try {
    userRolesArray = JSON.parse(userRole);
  } catch (error) {
    userRolesArray = [userRole];
  }

  // Check if any of the user's roles match the allowed roles
  if (roles.length > 0 && !roles.some((role) => userRolesArray.includes(role))) {
    Swal.fire({
      icon: 'warning',
      title: 'Access Denied',
      text: 'You do not have permission to view this page.',
      confirmButtonText: 'OK'
    });
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default PrivateRoute;
