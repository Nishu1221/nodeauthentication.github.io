const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { ensureAuthenticated } = require('./middleware/auth'); 
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Configure express-session
app.use(session({
    secret: '0', // Replace with your actual secret
    resave: true,
    saveUninitialized: true
  }));
// Passport configuration
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
