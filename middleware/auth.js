// /middleware/auth.js
module.exports = {
    ensureAuthenticated: (req, res, next) => {
      // Your authentication logic here
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login');
    },
  };
  