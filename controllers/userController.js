// /controllers/userController.js

const User = require('../models/User');

exports.getUserProfile = (req, res) => {
  res.render('userProfile', { user: req.user });
};

exports.updateUserProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    // Assuming you have a 'User' model with a 'findByIdAndUpdate' method
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    );

    res.render('userProfile', { user: updatedUser, successMessage: 'Profile updated successfully.' });
  } catch (error) {
    console.error(error);
    res.render('userProfile', { user: req.user, errorMessage: 'Error updating profile.' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = req.user;

    // Check if the current password is correct
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.render('userProfile', { user, errorMessage: 'Current password is incorrect.' });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    res.render('userProfile', { user, successMessage: 'Password changed successfully.' });
  } catch (error) {
    console.error(error);
    res.render('userProfile', { user: req.user, errorMessage: 'Error changing password.' });
  }
};
