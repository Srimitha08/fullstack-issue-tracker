const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize('admin', 'manager'), createProject);
router.get('/', authMiddleware, getProjects);
router.get('/:id', authMiddleware, getProjectById);
router.patch('/:id', authMiddleware, authorize('admin', 'manager'), updateProject);
router.delete('/:id', authMiddleware, authorize('admin', 'manager'), deleteProject);

module.exports = router;
