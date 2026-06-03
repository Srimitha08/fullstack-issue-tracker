const Issue = require('../models/Issue');
const Project = require('../models/Project');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { generateId } = require('../utils/helpers');
const { sanitizeInput, validatePriority, validateStatus } = require('../middleware/validation');

// Create issue
exports.createIssue = async (req, res) => {
  try {
    const { title, description, projectId, priority, severity, dueDate } = req.body;
    
    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Title and project are required',
        data: {}
      });
    }
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project reference',
        data: {}
      });
    }
    
    // Check for duplicate title in same project
    const existing = await Issue.findOne({ title, project: projectId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate issue title in this project',
        data: {}
      });
    }
    
    if (priority && !validatePriority(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority value',
        data: {}
      });
    }
    
    const issue = await Issue.create({
      issueId: generateId('ISS'),
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      project: projectId,
      reportedBy: req.user._id,
      priority: priority || 'medium',
      severity: severity || 'medium',
      status: 'open',
      dueDate
    });
    
    const populatedIssue = await issue.populate(['project', 'assignedTo', 'reportedBy']);
    
    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      issue: issue._id,
      action: 'Issue created',
      newStatus: 'open',
      timestamp: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: populatedIssue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Get all issues
exports.getIssues = async (req, res) => {
  try {
    const { status, priority, severity, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (severity) {
      query.severity = severity;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const issues = await Issue.find(query)
      .populate(['project', 'assignedTo', 'reportedBy'])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Issue.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Issues retrieved successfully',
      data: issues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
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

// Get issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(['project', 'assignedTo', 'reportedBy']);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
        data: {}
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Issue retrieved successfully',
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Update issue
exports.updateIssue = async (req, res) => {
  try {
    const { title, description, priority, severity, dueDate } = req.body;
    
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
        data: {}
      });
    }
    
    if (issue.status === 'closed' || issue.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update closed or resolved issues',
        data: {}
      });
    }
    
    if (title) issue.title = sanitizeInput(title);
    if (description) issue.description = sanitizeInput(description);
    if (priority && validatePriority(priority)) issue.priority = priority;
    if (severity) issue.severity = severity;
    if (dueDate) issue.dueDate = dueDate;
    
    issue.updatedAt = new Date();
    await issue.save();
    
    const updatedIssue = await issue.populate(['project', 'assignedTo', 'reportedBy']);
    
    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: updatedIssue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Delete issue
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
        data: {}
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Assign issue
exports.assignIssue = async (req, res) => {
  try {
    const { assignedToId } = req.body;
    
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
        data: {}
      });
    }
    
    if (issue.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign closed issues',
        data: {}
      });
    }
    
    const user = await User.findById(assignedToId);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user does not exist',
        data: {}
      });
    }
    
    const previousAssignee = issue.assignedTo;
    issue.assignedTo = assignedToId;
    await issue.save();
    
    const updatedIssue = await issue.populate(['project', 'assignedTo', 'reportedBy']);
    
    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      issue: issue._id,
      action: `Issue assigned to ${user.name}`,
      timestamp: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Issue assigned successfully',
      data: updatedIssue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Update issue status
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!validateStatus(status, 'issue')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        data: {}
      });
    }
    
    const issue = await Issue.findById(req.params.id).populate('assignedTo');
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
        data: {}
      });
    }
    
    // Workflow validation
    if (issue.status === 'closed' && status !== 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Closed issues cannot be reopened without explicit action',
        data: {}
      });
    }
    
    if (issue.status === 'resolved' && status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Resolved issues cannot be edited directly',
        data: {}
      });
    }
    
    if (status === 'testing' && issue.assignedTo?._id?.toString() !== req.user._id?.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Only assigned developer can move issue to testing',
        data: {}
      });
    }
    
    if (status === 'closed' && req.user.role === 'tester') {
      return res.status(400).json({
        success: false,
        message: 'Testers cannot close issues directly',
        data: {}
      });
    }
    
    const previousStatus = issue.status;
    issue.status = status;
    await issue.save();
    
    const updatedIssue = await issue.populate(['project', 'assignedTo', 'reportedBy']);
    
    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      issue: issue._id,
      action: `Status changed`,
      previousStatus,
      newStatus: status,
      timestamp: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      data: updatedIssue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};
