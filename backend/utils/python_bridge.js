const { spawn } = require('child_process');
const path = require('path');

// Function to get the correct Python executable path based on the operating system
const getPythonPath = () => {
  // Check if we're in a production environment
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    // In production, use system Python
    return 'python3';
  }
  
  const isWindows = process.platform === 'win32';
  const pythonPath = isWindows 
    ? path.join(__dirname, '..', 'ai_career_env', 'Scripts', 'python.exe')
    : path.join(__dirname, '..', 'ai_career_env', 'bin', 'python');
  
  return pythonPath;
};

// Function to call Python script for resume parsing
const parseResume = (filePath, fileType) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Path to Python executable in virtual environment
      const pythonPath = getPythonPath();
      
      // Check if Python is available
      const { exec } = require('child_process');
      exec('python3 --version', (error, stdout, stderr) => {
        if (error) {
          console.log('Python not available, using mock parser');
          // Resolve with a promise that returns mock data
          resolve(mockParseResume(filePath, fileType));
          return;
        }
      });
      
      // Path to Python script
      const scriptPath = path.join(__dirname, 'ai_career_engine.py');
      
      // Check if the Python script exists before spawning
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        console.log('Python script not found, using mock parser');
        resolve(mockParseResume(filePath, fileType));
        return;
      }
      
      // Spawn Python process
      const pythonProcess = spawn(pythonPath, [scriptPath, 'parse', filePath, fileType]);
      
      let stdoutData = '';
      let stderrData = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(`Python script exited with code ${code}: ${stderrData}`);
          resolve(mockParseResume(filePath, fileType)); // Use mock as fallback
        } else {
          try {
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (parseError) {
            console.log(`Failed to parse Python output: ${parseError.message}`);
            resolve(mockParseResume(filePath, fileType)); // Use mock as fallback
          }
        }
      });
      
      // Add timeout to prevent hanging processes
      setTimeout(() => {
        pythonProcess.kill();
        resolve(mockParseResume(filePath, fileType));
      }, 30000); // 30 second timeout
      
    } catch (error) {
      console.log('Error setting up Python process:', error.message);
      resolve(mockParseResume(filePath, fileType)); // Use mock as fallback
    }
  });
};

// Function to call Python script for job matching
const matchJob = (resumeSkills, jobTitle) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Path to Python executable in virtual environment
      const pythonPath = getPythonPath();
      
      // Check if Python is available
      const { exec } = require('child_process');
      exec('python3 --version', (error, stdout, stderr) => {
        if (error) {
          console.log('Python not available for job matching, using mock result');
          resolve(mockJobResult(resumeSkills, jobTitle));
          return;
        }
      });
      
      // Path to Python script
      const scriptPath = path.join(__dirname, 'ai_career_engine.py');
      
      // Check if the Python script exists before spawning
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        console.log('Python script not found for job matching, using mock result');
        resolve(mockJobResult(resumeSkills, jobTitle));
        return;
      }
      
      // Spawn Python process
      const pythonProcess = spawn(pythonPath, [scriptPath, 'match', JSON.stringify(resumeSkills), jobTitle]);
      
      let stdoutData = '';
      let stderrData = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(`Python script exited with code ${code} for job matching: ${stderrData}`);
          resolve(mockJobResult(resumeSkills, jobTitle)); // Use mock as fallback
        } else {
          try {
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (parseError) {
            console.log(`Failed to parse Python output for job matching: ${parseError.message}`);
            resolve(mockJobResult(resumeSkills, jobTitle)); // Use mock as fallback
          }
        }
      });
      
      // Add timeout to prevent hanging processes
      setTimeout(() => {
        pythonProcess.kill();
        resolve(mockJobResult(resumeSkills, jobTitle));
      }, 30000); // 30 second timeout
      
    } catch (error) {
      console.log('Error setting up Python process for job matching:', error.message);
      resolve(mockJobResult(resumeSkills, jobTitle)); // Use mock as fallback
    }
  });
};

// Function to call Python script for job recommendations
const getJobRecommendations = (resumeSkills) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Path to Python executable in virtual environment
      const pythonPath = getPythonPath();
      
      // Check if Python is available
      const { exec } = require('child_process');
      exec('python3 --version', (error, stdout, stderr) => {
        if (error) {
          console.log('Python not available for job recommendations, using mock result');
          resolve(mockRecommendations(resumeSkills));
          return;
        }
      });
      
      // Path to Python script
      const scriptPath = path.join(__dirname, 'ai_career_engine.py');
      
      // Check if the Python script exists before spawning
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        console.log('Python script not found for job recommendations, using mock result');
        resolve(mockRecommendations(resumeSkills));
        return;
      }
      
      // Spawn Python process
      const pythonProcess = spawn(pythonPath, [scriptPath, 'recommend', JSON.stringify(resumeSkills)]);
      
      let stdoutData = '';
      let stderrData = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(`Python script exited with code ${code} for job recommendations: ${stderrData}`);
          resolve(mockRecommendations(resumeSkills)); // Use mock as fallback
        } else {
          try {
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (parseError) {
            console.log(`Failed to parse Python output for job recommendations: ${parseError.message}`);
            resolve(mockRecommendations(resumeSkills)); // Use mock as fallback
          }
        }
      });
      
      // Add timeout to prevent hanging processes
      setTimeout(() => {
        pythonProcess.kill();
        resolve(mockRecommendations(resumeSkills));
      }, 30000); // 30 second timeout
      
    } catch (error) {
      console.log('Error setting up Python process for job recommendations:', error.message);
      resolve(mockRecommendations(resumeSkills)); // Use mock as fallback
    }
  });
};

// Function to call Python script for trending skills
const getTrendingSkills = () => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = getPythonPath();
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'trending']);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for ML-based future skills prediction
const predictFutureSkillsML = (skillsArray) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = getPythonPath();
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'predict_future', JSON.stringify(skillsArray)]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for interview question prediction
const predictInterviewQuestions = (resumeData) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = getPythonPath();
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'predict_questions', JSON.stringify(resumeData)]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for AI mentor responses
const getAIMentorResponse = (userQuery, resumeData) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = getPythonPath();
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'ai_mentor', userQuery, JSON.stringify(resumeData)]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Helper function for mock job matching result
const mockJobResult = (resumeSkills, jobTitle) => {
  const matchingSkills = resumeSkills.filter(skill => 
    jobTitle.toLowerCase().includes(skill.toLowerCase()) || 
    Math.random() > 0.5
  );
  
  return {
    job_title: jobTitle,
    company: 'Sample Company',
    location: 'Remote',
    url: '',
    match_score: Math.min(100, Math.round((matchingSkills.length / resumeSkills.length) * 100)),
    matching_skills: matchingSkills,
    missing_skills: resumeSkills.filter(skill => !matchingSkills.includes(skill)),
    total_required_skills: resumeSkills.length,
    salary_data: { avg_salary: '$80,000 - $120,000' }
  };
};

// Helper function for mock recommendations
const mockRecommendations = (skillsArray) => {
  return [
    { title: 'Junior Developer', company: 'Tech Corp', match_score: 85 },
    { title: 'Software Specialist', company: 'Innovation Inc', match_score: 78 },
    { title: 'Senior Developer', company: 'Enterprise Ltd', match_score: 72 }
  ];
};

module.exports = {
  parseResume,
  matchJob,
  getJobRecommendations,
  getTrendingSkills,
  predictFutureSkillsML,
  predictInterviewQuestions,
  getAIMentorResponse
};