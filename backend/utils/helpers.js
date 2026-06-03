const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const sanitizeObject = (obj, fieldsToSanitize = []) => {
  const sanitized = { ...obj };
  fieldsToSanitize.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].trim();
    }
  });
  return sanitized;
};

module.exports = {
  generateId,
  sanitizeObject
};
