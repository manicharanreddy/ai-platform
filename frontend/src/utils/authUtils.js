// Utility functions for authentication

// Function to handle Google OAuth callback and store user data
export const handleGoogleAuthCallback = () => {
  // Get the token, name, and email from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const name = urlParams.get('name');
  const email = urlParams.get('email');

  if (token && name && email) {
    // Store token in localStorage
    localStorage.setItem('token', token);

    // Store user data in localStorage
    const userData = {
      name: decodeURIComponent(name),
      email: decodeURIComponent(email)
    };
    localStorage.setItem('user', JSON.stringify(userData));

    // Clear the query parameters from the URL
    window.history.replaceState({}, document.title, window.location.pathname);

    // Return the user data
    return userData;
  }

  return null;
};

// Function to get the current user from localStorage
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Function to get the auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return getAuthToken() && getCurrentUser();
};

// Function to logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('resumeData');
};