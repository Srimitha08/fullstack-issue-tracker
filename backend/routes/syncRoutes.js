const express = require('express');
const router = express.Router();
const { syncData, health } = require('../controllers/syncController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize('admin', 'manager'), syncData);
router.get('/health', health);

module.exports = router;
