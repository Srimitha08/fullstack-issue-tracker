const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments,
  getCommentsByIssue,
  getCommentById,
  deleteComment
} = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createComment);
router.get('/', authMiddleware, getComments);
router.get('/issue/:issueId', authMiddleware, getCommentsByIssue);
router.get('/:id', authMiddleware, getCommentById);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
