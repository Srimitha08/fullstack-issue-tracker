const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateEmail, validatePassword, validateRole, sanitizeInput } = require('../middleware/validation');

// Register
exports.register = async (req, res) => {
  try {
    const { userId, name, email, password, role, department } = req.body;
    
    // Validation
    if (!userId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        data: {}
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        data: {}
      });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
        data: {}
      });
    }
    
    if (role && !validateRole(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
        data: {}
      });
    }
    
    // Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        data: {}
      });
    }
    
    // Create user
    const user = await User.create({
      userId: sanitizeInput(userId),
      name: sanitizeInput(name),
      email: email.toLowerCase(),
      password,
      role: role || 'developer',
      department: sanitizeInput(department)
    });
    
    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department
        },
        token
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

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
        data: {}
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: {}
      });
    }
    
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: {}
      });
    }
    
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status
        },
        token
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

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: {}
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Current user retrieved',
      data: {
        user: {
          _id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status
        }
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
