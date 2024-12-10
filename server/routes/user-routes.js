const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/admin/user-controller'); // Adjust path

// Middleware for authentication/authorization if needed
const { authenticateToken, authorizeRole } = require('../middleware/index');

// Route to get all users
router.get('/users', authenticateToken, authorizeRole('admin'), getAllUsers);

// Route to update a user's role
router.put('/users/:userId/role', authenticateToken, authorizeRole('admin'), updateUserRole);

module.exports = router;