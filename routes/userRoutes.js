// /routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/auth'); // Use a relative path

// Route to render user profile page
router.get('/profile', ensureAuthenticated, userController.getUserProfile);

// Route to handle updating user profile
router.post('/profile/update', ensureAuthenticated, userController.updateUserProfile);

// Route to handle changing user password
router.post('/profile/change-password', ensureAuthenticated, userController.changePassword);

module.exports = router;
