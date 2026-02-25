import axios from 'axios';
import config from '../config/apiConfig';

const api = axios.create({
  baseURL: config.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export const uploadResume = (formData) => {
  return api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getJobMatch = (data) => {
  return api.post('/resume/match', data);
};

export const simulateCareerPath = (data) => {
  return api.post('/resume/simulate-career', data);
};

export const predictFutureSkills = (data) => {
  return api.post('/trending/predict-skills', data);
};

export const checkBias = (data) => {
  return api.post('/career/check-bias', data);
};

export const generatePortfolio = (data) => {
  return api.post('/career/generate-portfolio', data);
};

export const predictInterviewQuestions = (data) => {
  return api.post('/career/predict-interview-questions', data);
};

export const getAIMentorResponse = (data) => {
  return api.post('/career/ai-mentor', data);
};

export default api;