const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Google OAuth callback handler
const googleOAuthCallback = async (req, res) => {
  try {
    const { user } = req;
    
    if (!user) {
      return res.status(400).json({ message: 'Google authentication failed' });
    }
    
    // Check if user already exists with googleId
    let dbUser = await User.findOne({ googleId: user.googleId });
    
    if (dbUser) {
      // User already exists via Google OAuth
      const token = generateToken(dbUser._id);
      return res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(dbUser.name)}&email=${encodeURIComponent(dbUser.email)}`);
    }
    
    // Check if user exists with the same email but registered differently
    dbUser = await User.findOne({ email: user.email });
    
    if (dbUser) {
      // Link Google account to existing user
      dbUser.googleId = user.googleId;
      dbUser.isGoogleUser = true;
      await dbUser.save();
      
      const token = generateToken(dbUser._id);
      return res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(dbUser.name)}&email=${encodeURIComponent(dbUser.email)}`);
    }
    
    // Create new user
    dbUser = await User.create({
      name: user.displayName,
      email: user.email,
      googleId: user.googleId,
      isGoogleUser: true
    });
    
    const token = generateToken(dbUser._id);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(dbUser.name)}&email=${encodeURIComponent(dbUser.email)}`);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

// Handle auth callback
const handleAuthCallback = async (req, res) => {
  try {
    // This endpoint will be called from frontend after successful redirect
    // The token is passed as query param, frontend will handle storing it
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleOAuthCallback,
  handleAuthCallback
};