# Render Deployment Setup Guide

This guide explains how to properly deploy the AI Career Platform backend to Render with full Python functionality.

## Prerequisites

1. **MongoDB Atlas Account**: Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas/database) and get your connection string
2. **Render Account**: Sign up at [Render](https://render.com)

## Deployment Steps

### 1. Fork or Clone the Repository

Make sure your repository is available on GitHub, GitLab, or Bitbucket.

### 2. Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your repository provider (GitHub, GitLab, or Bitbucket)
4. Select your forked/cloned repository

### 3. Configure the Web Service

#### Basic Configuration:
- **Environment**: Node
- **Region**: Choose based on your preference (Frankfurt, Oregon, Virginia)
- **Branch**: main (or your default branch)

#### Build Command:
```bash
npm install
# Install Python and required dependencies
apt-get update && apt-get install -y python3 python3-pip python3-dev build-essential
pip3 install --break-system-packages --upgrade pip
pip3 install --break-system-packages -r python_requirements.txt
# Download NLTK data
python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"
# Download spaCy model
python3 -m spacy download en_core_web_sm
```

#### Start Command:
```bash
npm start
```

#### Environment Variables:
Add the following environment variables:

- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: `5000` (or leave empty to use Render's default)

### 4. Alternative: Using Docker (Recommended)

If you prefer to use the Dockerfile provided in the backend directory:

1. In your Render dashboard, create a "Docker" service instead of a "Web Service"
2. Point it to the `/backend` directory
3. Use the Dockerfile in the `/backend` directory

## Important Notes

- The Python environment will be set up automatically during deployment
- NLTK data and spaCy models will be downloaded during the build process
- Make sure your MongoDB connection string is properly configured
- The service will be available at the URL provided by Render

## Troubleshooting

### Common Issues:

1. **Python Dependencies Installation Failure**: Ensure all Python packages in `python_requirements.txt` are compatible with the Python version on Render

2. **NLTK/SpaCy Model Downloads Fail**: These downloads happen during build time. If they fail, the build will fail and you'll need to redeploy.

3. **File Permission Issues**: The Dockerfile creates the uploads directory with proper permissions.

4. **Memory Issues**: If your Python processes consume too much memory, consider upgrading your Render plan.

### Health Checks:

The application has a health check endpoint at `/` which returns:
```json
{
  "message": "AI Career Platform API"
}
```

## Scaling

For production use, consider:
- Upgrading to a higher-tier instance if you expect heavy load
- Setting up a dedicated MongoDB cluster with more capacity
- Enabling auto-deployment for continuous integration