# AI Career Platform

An AI-powered career development platform that helps users optimize their resumes, find suitable job roles, and plan their career paths.

## Environment Setup

Before running the application, you need to set up environment variables:

1. Copy the example environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Update the `.env` files with your actual credentials:
   - MongoDB connection string
   - Google OAuth credentials
   - API keys for AI services
   - Other required environment variables

**Important**: Never commit your actual `.env` files to version control. The `.gitignore` file is configured to exclude them.

## Features

1. **Resume Upload & Parsing**
   - Upload resumes in PDF, DOC, or DOCX formats
   - Automatic parsing and extraction of key information

2. **Job Role Matching**
   - Enter a job role to see how well your resume matches
   - Get a match score and recommendations for improvement
   - Identify missing skills for your target role

3. **AI Career Path Simulator**
   - Shows future career outcomes based on skills you add/learn
   - Provides step-by-step career progression guidance

4. **Future Skill Predictor (2-5 Year Forecast)**
   - Predicts upcoming in-demand skills before they peak
   - Helps users stay ahead of industry trends

5. **Bias & Inclusivity Checker**
   - Ensures resumes are free of biased or non-inclusive language
   - Provides suggestions for improvement

6. **AI Portfolio Generator**
   - Converts resume information into a professional portfolio
   - Generates project ideas and portfolio website

7. **AI Mentor Chat**
   - Get personalized career guidance based on your resume and goals
   - Ask questions about career paths, skill development, and project ideas
   - Receive tailored advice for your specific situation

## Technology Stack

### Frontend
- React.js
- CSS3 for styling
- Axios for API requests

### Backend
- Node.js with Express.js
- Multer for file uploads
- PDF-Parse for PDF processing
- Natural for NLP tasks

### AI/ML Components
- NLP models for resume parsing
- Machine learning models for skill matching
- Predictive models for future skills forecasting
- Python libraries: NLTK, spaCy, scikit-learn, pandas, numpy

## Project Structure

```
ai-career-platform/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── pages/
│       ├── App.js
│       └── index.js
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    └── server.js
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Python 3.8 or higher

### Automated Setup (Recommended)
Run the setup script from the root directory:

**Windows:**
```
setup.bat
```

**Linux/Mac:**
```
chmod +x setup.sh
./setup.sh
```

### Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Set up Python virtual environment:
   ```
   python -m venv ai_career_env
   ```

4. Activate the virtual environment:
   
   **Windows:**
   ```
   ai_career_env\Scripts\activate
   ```
   
   **Linux/Mac:**
   ```
   source ai_career_env/bin/activate
   ```

5. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

6. Download required NLTK data:
   ```
   # While in the virtual environment
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"
   ```

7. Start the server:
   ```
   npm start
   ```
   or for development with auto-restart:
   ```
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

- `POST /api/resume/upload` - Upload and parse a resume
- `POST /api/job/match` - Get job matching score and recommendations
- `POST /api/career/simulate` - Simulate career path based on skills
- `POST /api/skills/predict` - Predict future in-demand skills
- `POST /api/bias/check` - Check resume for biased language
- `POST /api/portfolio/generate` - Generate portfolio from resume data
- `POST /api/career/ai-mentor` - Get AI mentor responses for career guidance

## Future Enhancements

1. Integration with job boards for real-time job recommendations
2. LinkedIn profile analysis and optimization
3. Salary prediction based on skills and experience
4. Interview preparation tools with AI-generated questions
5. Personalized learning path recommendations
6. Industry trend analysis and visualization

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.

## Deployment

The AI Career Platform can be deployed to cloud platforms for public access. The application consists of a React.js frontend and a Node.js/Express backend with MongoDB Atlas database integration.

### Prerequisites for Deployment

- Node.js (v14 or higher)
- npm (v6 or higher)
- Heroku CLI (for backend deployment)
- Vercel CLI or Netlify CLI (for frontend deployment)

### Deployment Options

We provide two deployment scripts to automate the process:

#### Windows Deployment
Run the deployment script:
```bash
deploy.bat
```

#### Unix/Linux/macOS Deployment
Run the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Render Deployment (Recommended for Full Python Functionality)

For deploying the backend with full Python AI functionality, we recommend using Render. The application has been configured to work properly with Render's infrastructure.

#### Prerequisites for Render Deployment

- A GitHub, GitLab, or Bitbucket repository containing your code
- MongoDB Atlas account for database hosting
- Render account at https://render.com

#### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Follow the detailed instructions in the [RENDER_SETUP.md](RENDER_SETUP.md) file to configure your Render service
3. The Dockerfile in the `/backend` directory ensures Python and all dependencies are properly installed
4. The build process will automatically install Python packages and download required NLTK/spaCy models

### Manual Deployment Steps

#### Backend Deployment (to Heroku)

1. Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
2. Login to Heroku: `heroku login`
3. Navigate to the backend directory: `cd backend`
4. Create a new Heroku app: `heroku create your-app-name-backend`
5. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://aiuser:Manicharan%4012@cluster0.7pa4of5.mongodb.net/ai-career-platform?retryWrites=true&w=majority"
   heroku config:set JWT_SECRET="your_secure_jwt_secret_here"
   heroku config:set GEMINI_API_KEY="AIzaSyBcZLRzxeeYffXS5gonBHz3J-SodNyrMpQ"
   ```
6. Deploy the app: `git push heroku main`

#### Frontend Deployment (to Vercel or Netlify)

1. **Using Vercel:**
   - Install Vercel CLI: `npm install -g vercel`
   - Login to Vercel: `vercel login`
   - Navigate to frontend directory: `cd frontend`
   - Deploy with environment variable: `vercel --prod --env REACT_APP_API_BASE_URL=YOUR_BACKEND_URL`

2. **Using Netlify:**
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Login to Netlify: `netlify login`
   - Build the project: `npm run build`
   - Deploy: `netlify deploy --dir=build --prod`

### Environment Variables

#### Backend (Heroku)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret for JWT token generation
- `GEMINI_API_KEY`: Google Gemini API key

#### Frontend (Vercel/Netlify)
- `REACT_APP_API_BASE_URL`: URL of the deployed backend API