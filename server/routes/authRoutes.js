const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers, updateUser, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Admin only routes
router.get('/users', protect, authorize('admin'), getUsers);
router.route('/users/:id')
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;