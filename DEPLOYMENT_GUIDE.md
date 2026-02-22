# AI Career Platform - Deployment Guide

This document provides detailed instructions for deploying the full-stack AI Career Platform to cloud platforms.

## Overview

The AI Career Platform is a full-stack application consisting of:
- **Frontend**: React.js application
- **Backend**: Node.js/Express.js API server
- **Database**: MongoDB Atlas (cloud database)
- **AI Services**: Google Gemini API integration

## Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v14 or higher)
2. **npm** (v6 or higher)
3. Accounts with deployment platforms:
   - [Heroku](https://heroku.com) for backend deployment
   - [Vercel](https://vercel.com) or [Netlify](https://netlify.com) for frontend deployment
4. Installed CLI tools:
   - Heroku CLI: `npm install -g heroku`
   - Vercel CLI: `npm install -g vercel` (or Netlify CLI: `npm install -g netlify-cli`)

## Deployment Process

### Method 1: Using Deployment Scripts (Recommended)

The project includes automated deployment scripts for convenience:

#### For Windows:
```bash
deploy.bat
```

#### For Unix/Linux/macOS:
```bash
chmod +x deploy.sh
./deploy.sh
```

Follow the interactive prompts to deploy either the backend, frontend, or both.

### Method 2: Manual Deployment

#### Step 1: Deploy Backend to Heroku

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create a new Heroku app**:
   ```bash
   heroku create your-app-name-backend
   ```
   Or use an existing app:
   ```bash
   heroku git:remote -a your-existing-app-name
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://aiuser:Manicharan%4012@cluster0.7pa4of5.mongodb.net/ai-career-platform?retryWrites=true&w=majority"
   heroku config:set JWT_SECRET="a_very_long_random_string_for_security"
   heroku config:set GEMINI_API_KEY="AIzaSyBcZLRzxeeYffXS5gonBHz3J-SodNyrMpQ"
   ```

5. **Deploy the application**:
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

6. **Verify deployment**:
   Visit the URL provided by Heroku to confirm your backend is running.

#### Step 2: Deploy Frontend to Vercel (Recommended)

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy with environment variables**:
   ```bash
   vercel --prod --env REACT_APP_API_BASE_URL=https://your-app-name-backend.herokuapp.com/api
   ```
   Replace `https://your-app-name-backend.herokuapp.com/api` with your actual backend URL from Step 1.

#### Alternative: Deploy Frontend to Netlify

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Update environment variables**:
   Create/update `.env.production` with:
   ```
   REACT_APP_API_BASE_URL=https://your-app-name-backend.herokuapp.com/api
   ```

5. **Rebuild and deploy**:
   ```bash
   npm run build
   netlify deploy --dir=build --prod
   ```

## Post-Deployment Configuration

### Database Connection

Your application is already configured to use MongoDB Atlas with the connection string:
```
mongodb+srv://aiuser:Manicharan%4012@cluster0.7pa4of5.mongodb.net/ai-career-platform?retryWrites=true&w=majority
```

### Environment Variables Reference

#### Backend (Heroku)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret string for JWT token generation (should be at least 32 random characters)
- `GEMINI_API_KEY`: Google Gemini API key

#### Frontend (Vercel/Netlify)
- `REACT_APP_API_BASE_URL`: Base URL for your backend API (e.g., `https://your-app-name.herokuapp.com/api`)

## Security Considerations

1. **JWT Secret**: Change the JWT_SECRET to a strong, randomly generated string in production
2. **API Keys**: Store API keys securely in environment variables, not in code
3. **Database**: Ensure your MongoDB Atlas cluster has proper IP whitelisting
4. **HTTPS**: Both frontend and backend should communicate over HTTPS in production

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from your frontend's domain
2. **Database Connection**: Verify the MongoDB Atlas connection string and network access settings
3. **Environment Variables**: Confirm all required environment variables are set on the deployment platform
4. **Build Failures**: Check that all dependencies are properly listed in package.json files

### Verification Steps

1. Confirm backend is responding at its URL
2. Test the `/` endpoint to verify the API is running
3. Check that frontend can communicate with backend APIs
4. Verify all platform features work as expected

## Updating Deployed Applications

### Backend Updates
```bash
cd backend
git add .
git commit -m "Description of changes"
git push heroku main
```

### Frontend Updates
```bash
cd frontend
npm run build
vercel --prod  # or netlify deploy --prod
```

## Scaling Recommendations

1. **Database**: Monitor MongoDB Atlas performance and scale as needed
2. **Backend**: Adjust Heroku dyno size based on traffic demands
3. **Frontend**: Leverage CDN capabilities of Vercel/Netlify for global distribution
4. **AI Services**: Monitor API usage for Google Gemini and adjust quotas if needed