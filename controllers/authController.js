// /controllers/authController.js

const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Validation: Check if passwords match
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/signup');
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash('error', 'Email is already in use');
      return res.redirect('/signup');
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    req.flash('success', 'Account created successfully');
    res.redirect('/login');
  } catch (error) {
    console.error('Error in user registration:', error.message);
    req.flash('error', 'An error occurred during registration');
    res.redirect('/signup');
  }
};

exports.login = passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true,
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Logged out successfully');
  res.redirect('/');
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Email not found');
      return res.redirect('/forgot-password');
    }

    // Generate and set a password reset token
    const resetToken = 'someGeneratedToken'; // Replace with actual token generation logic
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in one hour
    await user.save();

    // Send a reset password email (use nodemailer or your preferred email service)

    req.flash('success', 'Check your email for a password reset link');
    res.redirect('/login');
  } catch (error) {
    console.error('Error in forgot password:', error.message);
    req.flash('error', 'An error occurred during password reset');
    res.redirect('/forgot-password');
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Find the user with the provided reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash('error', 'Invalid or expired token');
      return res.redirect(`/reset-password/${token}`);
    }

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect(`/reset-password/${token}`);
    }

    // Encrypt and set the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success', 'Password reset successfully');
    res.redirect('/login');
  } catch (error) {
    console.error('Error in reset password:', error.message);
    req.flash('error', 'An error occurred during password reset');
    res.redirect(`/reset-password/${token}`);
  }
};
