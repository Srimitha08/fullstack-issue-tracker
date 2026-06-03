const express = require('express');
const router = express.Router();
const { issueAnalytics, projectAnalytics, developerAnalytics } = require('../controllers/analyticsController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.get('/issues', authMiddleware, authorize('admin', 'manager'), issueAnalytics);
router.get('/projects', authMiddleware, authorize('admin', 'manager'), projectAnalytics);
router.get('/developers', authMiddleware, authorize('admin', 'manager'), developerAnalytics);

module.exports = router;
