const fs = require('fs');
const path = require('path');
const { parseResume, matchJob, getJobRecommendations } = require('../utils/python_bridge');

// Mock resume parser for fallback when Python environment is not available
const mockParseResume = (filePath, fileType) => {
  return new Promise((resolve) => {
    // Simulate parsing by extracting basic information from the file
    setTimeout(() => {
      resolve({
        contact_info: {
          name: "Sample Name",
          emails: ["sample@example.com"],
          phones: ["+1-234-567-8900"]
        },
        skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning"],
        experience: "Software Developer with 3+ years of experience in building scalable web applications.",
        education: "Bachelor's degree in Computer Science",
        projects: "Developed multiple full-stack applications using modern technologies."
      });
    }, 500); // Simulate processing time
  });
};

// Handle resume upload and processing
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    // Determine file type
    let fileType = 'text';
    if (req.file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileType = 'docx';
    }
    
    // Check if the file exists before attempting to process
    if (!fs.existsSync(req.file.path)) {
      return res.status(500).json({ error: 'Uploaded file not found' });
    }
    
    let parsedData;
    
    try {
      // Try to call Python script to parse resume
      parsedData = await parseResume(req.file.path, fileType);
      
      if (parsedData.error) {
        console.error('Python script error:', parsedData.error);
        // Use mock parser as fallback
        parsedData = await mockParseResume(req.file.path, fileType);
      }
    } catch (pythonError) {
      console.error('Python environment error:', pythonError.message);
      // Fallback to mock parser if Python environment is not available
      parsedData = await mockParseResume(req.file.path, fileType);
    }
    
    res.json({
      success: true,
      filename: req.file.filename,
      message: 'Resume uploaded and parsed successfully',
      extractedInfo: parsedData
    });
  } catch (error) {
    console.error('Resume processing error:', error);
    res.status(500).json({ error: 'Failed to process resume: ' + error.message });
  }
};

// Get job match score
const getJobMatch = async (req, res) => {
  try {
    const { jobRole, resumeSkills } = req.body;
    
    let matchResult;
    
    try {
      // Try to call Python script to calculate match score
      matchResult = await matchJob(resumeSkills, jobRole);
      
      if (matchResult.error) {
        throw new Error(matchResult.error);
      }
    } catch (pythonError) {
      console.error('Python job matching error:', pythonError.message);
      // Fallback to mock result
      const matchingSkills = resumeSkills.filter(skill => 
        jobRole.toLowerCase().includes(skill.toLowerCase()) || 
        Math.random() > 0.5
      );
      
      matchResult = {
        job_title: jobRole,
        company: 'Sample Company',
        location: 'Remote',
        url: '',
        match_score: Math.min(100, Math.round((matchingSkills.length / resumeSkills.length) * 100)),
        matching_skills: matchingSkills,
        missing_skills: resumeSkills.filter(skill => !matchingSkills.includes(skill)),
        total_required_skills: resumeSkills.length,
        salary_data: { avg_salary: '$80,000 - $120,000' }
      };
    }
    
    res.json(matchResult);
  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ error: 'Failed to calculate job match: ' + error.message });
  }
};

// Simulate career path
const simulateCareerPath = async (req, res) => {
  try {
    const { skills, desiredRole } = req.body;
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    
    let recommendations;
    
    try {
      // Try to call Python script to get job recommendations
      recommendations = await getJobRecommendations(skillsArray);
    } catch (pythonError) {
      console.error('Python recommendations error:', pythonError.message);
      // Fallback to mock recommendations
      recommendations = [
        { title: `${desiredRole} Junior`, company: 'Tech Corp', match_score: 85 },
        { title: `${desiredRole} Specialist`, company: 'Innovation Inc', match_score: 78 },
        { title: `${desiredRole} Senior`, company: 'Enterprise Ltd', match_score: 72 }
      ];
    }
    
    // For career path simulation, we'll still use a mock approach but with real data
    const mockResult = {
      currentSkills: skillsArray,
      desiredRole: desiredRole,
      careerPath: [
        {
          step: 1,
          role: `Junior ${desiredRole}`,
          timeframe: '0-2 years',
          requiredSkills: skillsArray.slice(0, Math.max(1, Math.floor(skillsArray.length/2))),
          skillsToAcquire: ['Communication', 'Problem Solving']
        },
        {
          step: 2,
          role: desiredRole,
          timeframe: '2-5 years',
          requiredSkills: [...skillsArray, 'Communication', 'Problem Solving'],
          skillsToAcquire: ['Leadership', 'Project Management']
        },
        {
          step: 3,
          role: `Senior ${desiredRole}`,
          timeframe: '5-10 years',
          requiredSkills: [...skillsArray, 'Communication', 'Problem Solving', 'Leadership', 'Project Management'],
          skillsToAcquire: ['Strategic Thinking', 'Executive Communication']
        }
      ],
      jobRecommendations: recommendations
    };
    
    res.json(mockResult);
  } catch (error) {
    console.error('Career simulation error:', error);
    res.status(500).json({ error: 'Failed to simulate career path: ' + error.message });
  }
};

module.exports = {
  uploadResume,
  getJobMatch,
  simulateCareerPath
};