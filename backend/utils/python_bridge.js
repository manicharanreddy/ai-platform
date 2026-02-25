const { spawn } = require('child_process');
const path = require('path');

// Function to get the correct Python executable path based on the operating system
const getPythonPath = () => {
  // Check if we're in a production environment
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    // In production on Render, use system Python
    // First try the standard path
    if (process.env.RENDER_EXTERNAL_URL) {
      // On Render, use python3
      return 'python3';
    }
    return '/usr/bin/python3';
  }
  
  const isWindows = process.platform === 'win32';
  const pythonPath = isWindows 
    ? path.join(__dirname, '..', 'ai_career_env', 'Scripts', 'python.exe')
    : path.join(__dirname, '..', 'ai_career_env', 'bin', 'python');
  
  return pythonPath;
};

// Function to call Python script for resume parsing
const parseResume = (filePath, fileType) => {
  return new Promise((resolve, reject) => {
    try {
      // Path to Python executable in virtual environment
      const pythonPath = getPythonPath();
      
      // Path to Python script
      const scriptPath = path.join(__dirname, 'ai_career_engine.py');
      
      // Check if the Python script exists before spawning
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        reject(new Error(`Python script not found at: ${scriptPath}`));
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
      
      // Add timeout to prevent hanging processes
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python process timed out')); 
      }, 60000); // 60 second timeout
      
    } catch (error) {
      reject(new Error(`Error setting up Python process: ${error.message}`));
    }
  });
};

// Function to call Python script for job matching
const matchJob = (resumeSkills, jobTitle) => {
  return new Promise((resolve, reject) => {
    try {
      // Path to Python executable in virtual environment
      const pythonPath = getPythonPath();
      
      // Path to Python script
      const scriptPath = path.join(__dirname, 'ai_career_engine.py');
      
      // Check if the Python script exists before spawning
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        reject(new Error(`Python script not found for job matching at: ${scriptPath}`));
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
          reject(new Error(`Python script exited with code ${code} for job matching: ${stderrData}`));
        } else {
          try {
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (parseError) {
            reject(new Error(`Failed to parse Python output for job matching: ${parseError.message}`));
          }
        }
      });
      
      // Add timeout to prevent hanging processes
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python process for job matching timed out')); 
      }, 60000); // 60 second timeout
      
    } catch (error) {
      reject(new Error(`Error setting up Python process for job matching: ${error.message}`));
    }
  });
};

// Function to call Python script for job recommendations
const getJobRecommendations = (resumeSkills) => {
  return new Promise((resolve, reject) => {
    try {
      // Path to Python executable in virtual environment
      const pythonPath = getPythonPath();
      
      // Path to Python script
      const scriptPath = path.join(__dirname, 'ai_career_engine.py');
      
      // Check if the Python script exists before spawning
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        reject(new Error(`Python script not found for job recommendations at: ${scriptPath}`));
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
          reject(new Error(`Python script exited with code ${code} for job recommendations: ${stderrData}`));
        } else {
          try {
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (parseError) {
            reject(new Error(`Failed to parse Python output for job recommendations: ${parseError.message}`));
          }
        }
      });
      
      // Add timeout to prevent hanging processes
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python process for job recommendations timed out')); 
      }, 60000); // 60 second timeout
      
    } catch (error) {
      reject(new Error(`Error setting up Python process for job recommendations: ${error.message}`));
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



module.exports = {
  parseResume,
  matchJob,
  getJobRecommendations,
  getTrendingSkills,
  predictFutureSkillsML,
  predictInterviewQuestions,
  getAIMentorResponse
};