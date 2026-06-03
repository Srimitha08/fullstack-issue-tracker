const Issue = require('../models/Issue');
const Project = require('../models/Project');
const User = require('../models/User');

exports.issueAnalytics = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const openIssues = await Issue.countDocuments({ status: 'open' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const closedIssues = await Issue.countDocuments({ status: 'closed' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in progress' });
    const testingIssues = await Issue.countDocuments({ status: 'testing' });
    
    res.status(200).json({
      success: true,
      message: 'Issue analytics retrieved',
      data: {
        totalIssues,
        openIssues,
        resolvedIssues,
        closedIssues,
        inProgressIssues,
        testingIssues
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

exports.projectAnalytics = async (req, res) => {
  try {
    const projects = await Project.find();
    
    const analytics = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      inactiveProjects: projects.filter(p => p.status === 'inactive').length,
      closedProjects: projects.filter(p => p.status === 'closed').length,
      projectWiseIssueCount: []
    };
    
    for (const project of projects) {
      const issueCount = await Issue.countDocuments({ project: project._id });
      analytics.projectWiseIssueCount.push({
        projectId: project.projectId,
        projectName: project.title,
        issueCount
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project analytics retrieved',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

exports.developerAnalytics = async (req, res) => {
  try {
    const developers = await User.find({ role: 'developer' });
    
    const analytics = {
      developerStats: []
    };
    
    for (const dev of developers) {
      const assignedIssues = await Issue.find({ assignedTo: dev._id });
      const resolvedCount = assignedIssues.filter(i => i.status === 'resolved').length;
      
      let avgResolutionTime = 0;
      if (resolvedCount > 0) {
        const resolutionTimes = assignedIssues
          .filter(i => i.status === 'resolved')
          .map(i => (i.updatedAt - i.createdAt) / (1000 * 60 * 60)); // in hours
        avgResolutionTime = resolutionTimes.reduce((a, b) => a + b, 0) / resolvedCount;
      }
      
      analytics.developerStats.push({
        developerId: dev._id,
        name: dev.name,
        email: dev.email,
        assignedIssues: assignedIssues.length,
        resolvedIssues: resolvedCount,
        averageResolutionTimeHours: avgResolutionTime.toFixed(2)
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Developer analytics retrieved',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};
