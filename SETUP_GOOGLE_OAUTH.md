# Setting up Google OAuth for AI Career Platform

## Prerequisites

Before setting up Google OAuth, you'll need to:
1. Have a Google account
2. Access to Google Cloud Console
3. Your application deployed or running locally

## Steps to Configure Google OAuth

### 1. Create a Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)
4. Go to "Credentials" in the sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Set the application type to "Web application"
7. Give your OAuth client a name (e.g., "AI Career Platform")

### 2. Configure Authorized Redirect URIs

In the "Authorized redirect URIs" section, add:
- For local development: `http://localhost:5000/api/auth/google/callback`
- For production: `https://yourdomain.com/api/auth/google/callback`

### 3. Get Your Credentials

After creating the OAuth client, you'll receive:
- Client ID
- Client Secret

### 4. Update Environment Variables

Update the backend `.env` file with your credentials:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
CLIENT_URL=http://localhost:3000  # Or your frontend URL
```

### 5. Restart the Application

After updating the environment variables, restart both the backend and frontend servers.

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**: Double-check that the redirect URI in Google Cloud Console exactly matches what you're using in your application.

2. **"access_denied" Error**: Make sure your OAuth consent screen is properly configured and your application is not in testing mode if you're trying to use it broadly.

3. **Session Issues**: Make sure SESSION_SECRET is set to a strong, random value in production.

## Security Notes

- Never commit your actual Google Client ID and Secret to version control
- Use strong, unique values for SESSION_SECRET in production
- In production, set `secure: true` in the session configuration if using HTTPS