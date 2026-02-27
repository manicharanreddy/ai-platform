import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/apiConfig';
import '../styles/globals.css';
import './Auth.css';

const Login = ({ updateUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // ---------- EMAIL VALIDATION ----------
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return setEmailError("Email is required");
    if (!emailRegex.test(value)) return setEmailError("Enter a valid email");
    setEmailError("");
  };

  // ---------- PASSWORD VALIDATION ----------
  const validatePassword = (value) => {
    if (!value) return setPasswordError("Password is required");
    if (value.length < 6) return setPasswordError("Password must be at least 6 characters");
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Final validation before submit
    if (emailError || passwordError) {
      setError("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await fetch(`${config.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);

        // Store user data
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email
        };
        localStorage.setItem('user', JSON.stringify(userData));

        if (updateUser) updateUser(userData);

        navigate('/dashboard');
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Server error – please try again.");
    }
  };

  // Google OAuth login handler
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${config.baseURL}/auth/google`;
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* ------ EMAIL ------ */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              required
            />
            {emailError && <p className="input-error">{emailError}</p>}
          </div>

          {/* ------ PASSWORD ------ */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            {passwordError && <p className="input-error">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={emailError || passwordError}
          >
            Login
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="oauth-section">
          <div className="divider">
            <span>or</span>
          </div>
          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" width="20" height="20" />
            Sign in with Google
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?  
            <button onClick={() => navigate('/register')} className="link-button">
              Register
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
