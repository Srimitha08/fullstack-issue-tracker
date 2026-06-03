const Project = require('../models/Project');
const User = require('../models/User');
const { generateId, sanitizeObject } = require('../utils/helpers');
const { sanitizeInput } = require('../middleware/validation');

// Create project
exports.createProject = async (req, res) => {
  try {
    const { title, description, startDate } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Project title is required',
        data: {}
      });
    }
    
    const project = await Project.create({
      projectId: generateId('PRJ'),
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      owner: req.user._id,
      members: [req.user._id],
      startDate: startDate || new Date(),
      status: 'active'
    });
    
    const populatedProject = await project.populate(['owner', 'members']);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const { status, owner, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (owner) {
      const ownerUser = await User.findOne({ userId: owner });
      if (ownerUser) {
        query.owner = ownerUser._id;
      }
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const projects = await Project.find(query)
      .populate(['owner', 'members'])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Project.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
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

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(['owner', 'members']);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        data: {}
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, status, members } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        data: {}
      });
    }
    
    if (title) project.title = sanitizeInput(title);
    if (description) project.description = sanitizeInput(description);
    if (status) project.status = status;
    if (members) project.members = members;
    
    project.updatedAt = new Date();
    await project.save();
    
    const updatedProject = await project.populate(['owner', 'members']);
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        data: {}
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};
