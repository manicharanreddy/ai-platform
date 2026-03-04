const express = require('express');
const passport = require('passport');
const { googleOAuthCallback, handleAuthCallback } = require('../controllers/authController');

const router = express.Router();

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.NODE_ENV === 'production' 
      ? `${process.env.CLIENT_URL}/login` 
      : `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/login`
  }),
  googleOAuthCallback
);

router.get('/callback', handleAuthCallback);

module.exports = router;