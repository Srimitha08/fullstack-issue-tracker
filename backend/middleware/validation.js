const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validatePriority = (priority) => {
  return ['low', 'medium', 'high', 'critical'].includes(priority);
};

const validateSeverity = (severity) => {
  return ['low', 'medium', 'high', 'critical'].includes(severity);
};

const validateStatus = (status, type = 'issue') => {
  if (type === 'issue') {
    return ['open', 'in progress', 'testing', 'resolved', 'closed'].includes(status);
  } else if (type === 'project') {
    return ['active', 'inactive', 'closed'].includes(status);
  }
  return false;
};

const validateRole = (role) => {
  return ['admin', 'manager', 'developer', 'tester'].includes(role);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.trim(validator.escape(input));
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePriority,
  validateSeverity,
  validateStatus,
  validateRole,
  sanitizeInput
};
