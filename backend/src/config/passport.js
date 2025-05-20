const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findOrCreateUser } = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findOrCreateUser(profile);
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Only serialize ID
});

passport.deserializeUser(async (id, done) => {
  const user = await findOrCreateUser({ id }); // Simplified, mock lookup
  done(null, user);
});