const User = require('../models/User');
const Project = require('../models/Project');
const Issue = require('../models/Issue');
const { fetchExternalDataset } = require('../utils/externalApi');
const { validatePriority, validateStatus, validateRole } = require('../middleware/validation');
const { generateId } = require('../utils/helpers');

exports.syncData = async (req, res) => {
  try {
    const syncSummary = {
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
      duplicates: 0,
      errors: []
    };
    
    // Fetch dataset from external API
    let dataset;
    try {
      dataset = await fetchExternalDataset({
        username: process.env.EXTERNAL_API_USER,
        password: process.env.EXTERNAL_API_PASSWORD
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch external dataset',
        data: { syncSummary }
      });
    }
    
    if (!dataset) {
      return res.status(400).json({
        success: false,
        message: 'No dataset received',
        data: { syncSummary }
      });
    }
    
    // Process users
    if (dataset.users && Array.isArray(dataset.users)) {
      for (const userData of dataset.users) {
        syncSummary.totalRecords++;
        
        try {
          // Validate required fields
          if (!userData.userId || !userData.email || !userData.name) {
            syncSummary.invalidRecords++;
            syncSummary.errors.push(`Invalid user record: missing required fields`);
            continue;
          }
          
          // Validate email format
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            syncSummary.invalidRecords++;
            syncSummary.errors.push(`Invalid email format: ${userData.email}`);
            continue;
          }
          
          // Check for duplicates
          const existing = await User.findOne({ 
            $or: [{ userId: userData.userId }, { email: userData.email }] 
          });
          
          if (existing) {
            syncSummary.duplicates++;
            continue;
          }
          
          // Create user
          await User.create({
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
            password: 'Default@123',
            role: validateRole(userData.role) ? userData.role : 'developer',
            department: userData.department,
            status: 'active'
          });
          
          syncSummary.validRecords++;
        } catch (error) {
          syncSummary.invalidRecords++;
          syncSummary.errors.push(`Error processing user ${userData.userId}: ${error.message}`);
        }
      }
    }
    
    // Process projects
    if (dataset.projects && Array.isArray(dataset.projects)) {
      for (const projectData of dataset.projects) {
        syncSummary.totalRecords++;
        
        try {
          if (!projectData.projectId || !projectData.title) {
            syncSummary.invalidRecords++;
            continue;
          }
          
          const existing = await Project.findOne({ projectId: projectData.projectId });
          if (existing) {
            syncSummary.duplicates++;
            continue;
          }
          
          const owner = await User.findOne({ userId: projectData.owner });
          if (!owner) {
            syncSummary.invalidRecords++;
            syncSummary.errors.push(`Invalid owner reference in project ${projectData.projectId}`);
            continue;
          }
          
          await Project.create({
            projectId: projectData.projectId,
            title: projectData.title,
            description: projectData.description,
            owner: owner._id,
            members: [owner._id],
            status: validateStatus(projectData.status, 'project') ? projectData.status : 'active',
            startDate: projectData.startDate,
            endDate: projectData.endDate
          });
          
          syncSummary.validRecords++;
        } catch (error) {
          syncSummary.invalidRecords++;
          syncSummary.errors.push(`Error processing project ${projectData.projectId}: ${error.message}`);
        }
      }
    }
    
    // Process issues
    if (dataset.issues && Array.isArray(dataset.issues)) {
      for (const issueData of dataset.issues) {
        syncSummary.totalRecords++;
        
        try {
          if (!issueData.issueId || !issueData.title || !issueData.projectId) {
            syncSummary.invalidRecords++;
            continue;
          }
          
          // Validate priority
          if (issueData.priority && !validatePriority(issueData.priority)) {
            syncSummary.invalidRecords++;
            syncSummary.errors.push(`Invalid priority in issue ${issueData.issueId}`);
            continue;
          }
          
          // Validate status
          if (issueData.status && !validateStatus(issueData.status, 'issue')) {
            syncSummary.invalidRecords++;
            syncSummary.errors.push(`Invalid status in issue ${issueData.issueId}`);
            continue;
          }
          
          // Check for duplicates
          const existing = await Issue.findOne({ issueId: issueData.issueId });
          if (existing) {
            syncSummary.duplicates++;
            continue;
          }
          
          // Validate project reference
          const project = await Project.findOne({ projectId: issueData.projectId });
          if (!project) {
            syncSummary.invalidRecords++;
            syncSummary.errors.push(`Invalid project reference in issue ${issueData.issueId}`);
            continue;
          }
          
          // Validate assigned user
          let assignedTo = null;
          if (issueData.assignedTo) {
            const assignedUser = await User.findOne({ userId: issueData.assignedTo });
            if (!assignedUser) {
              syncSummary.invalidRecords++;
              syncSummary.errors.push(`Invalid assigned user in issue ${issueData.issueId}`);
              continue;
            }
            assignedTo = assignedUser._id;
          }
          
          // Validate reported by
          let reportedBy = null;
          if (issueData.reportedBy) {
            const reportedByUser = await User.findOne({ userId: issueData.reportedBy });
            reportedBy = reportedByUser ? reportedByUser._id : project.owner;
          } else {
            reportedBy = project.owner;
          }
          
          // Validate date if provided
          if (issueData.dueDate && isNaN(Date.parse(issueData.dueDate))) {
            syncSummary.invalidRecords++;
            syncSummary.errors.push(`Invalid date in issue ${issueData.issueId}`);
            continue;
          }
          
          await Issue.create({
            issueId: issueData.issueId,
            title: issueData.title,
            description: issueData.description,
            project: project._id,
            assignedTo,
            reportedBy,
            priority: issueData.priority || 'medium',
            severity: issueData.severity || 'medium',
            status: issueData.status || 'open',
            dueDate: issueData.dueDate
          });
          
          syncSummary.validRecords++;
        } catch (error) {
          syncSummary.invalidRecords++;
          syncSummary.errors.push(`Error processing issue ${issueData.issueId}: ${error.message}`);
        }
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Data sync completed',
      data: syncSummary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

exports.health = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const issueCount = await Issue.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'Health check passed',
      data: {
        status: 'healthy',
        timestamp: new Date(),
        database: 'connected',
        stats: {
          users: userCount,
          projects: projectCount,
          issues: issueCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      data: {}
    });
  }
};
