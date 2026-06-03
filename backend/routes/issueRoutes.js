const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  assignIssue,
  updateIssueStatus
} = require('../controllers/issueController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, createIssue);
router.get('/', authMiddleware, getIssues);
router.get('/:id', authMiddleware, getIssueById);
router.patch('/:id', authMiddleware, updateIssue);
router.delete('/:id', authMiddleware, deleteIssue);
router.patch('/:id/assign', authMiddleware, authorize('admin', 'manager'), assignIssue);
router.patch('/:id/status', authMiddleware, updateIssueStatus);

module.exports = router;
