const passport = require('passport');
const mongoose = require('mongoose');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google',{ failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/')
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/api/login', async (req, res) => {
    const existingUser = await User.findOne({ googleId: res.body.id });

      if (existingUser) {
        res.redirect('/')
        return done(null, existingUser);
      } else {
        res.send("there is no account for this user.")
        console.log(user);
      }
  });
};
