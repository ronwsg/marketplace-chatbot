import * as express from 'express'
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import config from '../config/server'

exports.registerPassportMiddleware = (app: express.Express) => {

  // Configure the Facebook strategy for use by Passport.
  //
  // OAuth 2.0-based strategies require a `verify` function which receives the
  // credential (`accessToken`) for accessing the Facebook API on the user's
  // behalf, along with the user's profile.  The function must invoke `cb`
  // with a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID || '__DUMMY_FACEBOOK_CLIENT_ID__',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '__DUMMY_FACEBOOK_CLIENT_SECRET__',
    callbackURL: '/auth/facebook/return',
    profileFields: ['id', 'first_name', 'last_name', 'displayName', 'picture', 'email', 'birthday', 'gender']
  },
    function (accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      return cb(null, profile);
    }));

  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Google
  //   profile), and invoke a callback with a user object.
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '__DUMMY_GOOGLE_CLIENT_ID__',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '__DUMMY_GOOGLE_CLIENT_SECRET__',
    callbackURL: '/auth/google/callback'
  },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  ));

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Twitter profile is serialized
  // and deserialized.
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());

  // ////////////////////////////////////////////////////////////////
  // authentication server APIs

  app.get('/auth/facebook',
    passport.authenticate('facebook'));

  app.get('/auth/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      res.cookie('user', JSON.stringify(req['user']), { maxAge: config.cookie.expiration })
      res.redirect('/');
    });

  // GET /auth/google
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Google authentication will involve
  //   redirecting the user to google.com.  After authorization, Google
  //   will redirect the user back to this application at /auth/google/callback
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

  // GET /auth/google/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
      res.cookie('user', JSON.stringify(req['user']), { maxAge: config.cookie.expiration })
      res.redirect('/');
    });
}
