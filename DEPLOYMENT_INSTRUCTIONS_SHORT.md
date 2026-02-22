# AI Career Platform - Quick Deployment Instructions

## Backend Deployment (to Heroku)

### Prerequisites
- Heroku CLI installed
- Heroku account created

### Steps
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create new app:
   ```bash
   heroku create your-app-name-backend
   ```

4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://aiuser:Manicharan%4012@cluster0.7pa4of5.mongodb.net/ai-career-platform?retryWrites=true&w=majority"
   heroku config:set JWT_SECRET="replace_with_your_strong_secret"
   heroku config:set GEMINI_API_KEY="AIzaSyBcZLRzxeeYffXS5gonBHz3J-SodNyrMpQ"
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

## Frontend Deployment (to Vercel)

### Prerequisites
- Vercel CLI installed
- Vercel account created

### Steps
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy with environment variable:
   ```bash
   vercel --prod --env REACT_APP_API_BASE_URL=https://your-backend-app.herokuapp.com/api
   ```

## Frontend Deployment (to Netlify)

### Prerequisites
- Netlify CLI installed
- Netlify account created

### Steps
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Build and deploy:
   ```bash
   npm run build
   netlify deploy --dir=build --prod
   ```

## Important Notes

- Replace `your-backend-app.herokuapp.com` with your actual backend URL
- Update JWT_SECRET with a strong, random string in production
- Ensure MongoDB Atlas allows connections from your deployment environment
- The application is already configured to use MongoDB Atlas