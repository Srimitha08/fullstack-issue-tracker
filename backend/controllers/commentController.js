const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const { generateId } = require('../utils/helpers');
const { sanitizeInput } = require('../middleware/validation');

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { message, issueId } = req.body;
    
    if (!message || !issueId) {
      return res.status(400).json({
        success: false,
        message: 'Message and issue are required',
        data: {}
      });
    }
    
    const issue = await Issue.findById(issueId);
    
    if (!issue) {
      return res.status(400).json({
        success: false,
        message: 'Issue not found',
        data: {}
      });
    }
    
    const comment = await Comment.create({
      commentId: generateId('COM'),
      issue: issueId,
      user: req.user._id,
      message: sanitizeInput(message)
    });
    
    const populatedComment = await comment.populate(['issue', 'user']);
    
    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Get all comments or comments for an issue via query param
exports.getComments = async (req, res) => {
  try {
    const { issueId } = req.query;

    let query = {};
    if (issueId) query.issue = issueId;

    const comments = await Comment.find(query)
      .populate(['issue', 'user'])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Get single comment by id
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate(['issue', 'user']);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
        data: {}
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment retrieved successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Get comments for issue (route: /issue/:issueId)
exports.getCommentsByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const comments = await Comment.find({ issue: issueId })
      .populate(['issue', 'user'])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
        data: {}
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};
