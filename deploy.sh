#!/bin/bash

echo "AI Career Platform Deployment Script"
echo "====================================="

# Function to deploy backend to Heroku
deploy_backend() {
    echo "Deploying Backend to Heroku..."
    cd backend
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "Heroku CLI is not installed. Please install it from https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Login to Heroku (this will prompt for credentials)
    heroku login
    
    # Create a new Heroku app or use existing one
    read -p "Enter your Heroku app name (or press Enter to create a new one): " app_name
    if [ -z "$app_name" ]; then
        heroku create
    else
        heroku create $app_name
    fi
    
    # Set environment variables
    echo "Setting environment variables..."
    heroku config:set MONGODB_URI="mongodb+srv://aiuser:Manicharan%4012@cluster0.7pa4of5.mongodb.net/ai-career-platform?retryWrites=true&w=majority"
    heroku config:set JWT_SECRET=$(openssl rand -base64 32)
    heroku config:set GEMINI_API_KEY="AIzaSyBcZLRzxeeYffXS5gonBHz3J-SodNyrMpQ"
    
    # Deploy the app
    git add .
    git commit -m "Prepare for Heroku deployment" || echo "Continuing with deployment..."
    git push heroku main
    
    echo "Backend deployed successfully!"
    BACKEND_URL=$(heroku info --app $(heroku apps:info --shell | head -n1 | cut -d'=' -f2) | grep "Web URL" | cut -d':' -f2- | xargs)
    echo "Backend URL: $BACKEND_URL"
}

# Function to deploy frontend to Netlify
deploy_frontend_netlify() {
    echo "Deploying Frontend to Netlify..."
    cd ../frontend
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    # Login to Netlify
    netlify login
    
    # Build the frontend
    npm run build
    
    # Prompt for backend URL
    read -p "Enter your deployed backend URL (e.g., https://your-app-name.herokuapp.com/api): " backend_url
    
    # Update the env file temporarily for this build
    echo "REACT_APP_API_BASE_URL=$backend_url" > .env.production
    cp .env.production .env
    
    # Rebuild with the production API URL
    npm run build
    
    # Deploy to Netlify
    netlify deploy --dir=build --prod
    
    echo "Frontend deployed successfully to Netlify!"
}

# Function to deploy frontend to Vercel
deploy_frontend_vercel() {
    echo "Deploying Frontend to Vercel..."
    cd ../frontend
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Login to Vercel
    vercel login
    
    # Prompt for backend URL
    read -p "Enter your deployed backend URL (e.g., https://your-app-name.herokuapp.com/api): " backend_url
    
    # Deploy with environment variables
    vercel --prod --env REACT_APP_API_BASE_URL=$backend_url
    
    echo "Frontend deployed successfully to Vercel!"
}

# Main menu
echo "Choose deployment option:"
echo "1) Deploy Backend to Heroku"
echo "2) Deploy Frontend to Netlify"
echo "3) Deploy Frontend to Vercel"
echo "4) Deploy Full Stack (Backend + Frontend)"
read -p "Enter your choice (1-4): " choice

case $choice in
    1) deploy_backend ;;
    2) deploy_frontend_netlify ;;
    3) deploy_frontend_vercel ;;
    4) 
        deploy_backend
        echo "Backend deployment completed. Please note your backend URL."
        read -p "Press Enter after noting the backend URL to continue with frontend deployment..."
        deploy_frontend_vercel  # Using Vercel as default for frontend
        ;;
    *) 
        echo "Invalid choice"
        exit 1
        ;;
esac

echo "Deployment process completed!"