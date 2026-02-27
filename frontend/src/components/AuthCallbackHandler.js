import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleGoogleAuthCallback } from '../utils/authUtils';

const AuthCallbackHandler = ({ updateUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle Google OAuth callback if we're on the auth callback route
    if (location.pathname === '/auth/callback' || location.search.includes('token=')) {
      const userData = handleGoogleAuthCallback();
      
      if (userData && updateUser) {
        updateUser(userData);
      }
      
      // Redirect to dashboard after processing
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); // Small delay to allow state updates
    }
  }, [location, navigate, updateUser]);

  return null; // This component doesn't render anything
};

export default AuthCallbackHandler;