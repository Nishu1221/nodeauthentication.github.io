// ./config/passport.js
const LocalStrategy = require('passport-local').Strategy;

// Assuming you have a User model
const User = require('../models/User');

module.exports = function(passport) {
  // Local Strategy for username/password authentication
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and verify password
        if (!user || !user.verifyPassword(password)) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        // Authentication successful
        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    })
  );

  // Serialize user to store in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });
};
