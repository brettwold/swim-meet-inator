'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models').User;
var Swimmer = require('../models').Swimmer;
var dotenv = require('dotenv');
dotenv.load();

var INCLUDES = [
  { model: Swimmer, through: 'UserSwimmers', as: "swimmers" }
];

var Auth = function () {};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3456/auth/google/callback",
    scope: ['email']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ where: { google_id: profile.id },
      defaults: {
        google_id: profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        photo: profile.photos[0].value,
        role: 'user'
      },
      include: INCLUDES
    }).spread(function(user, created) {
      done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

Auth.prototype.isAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
  } else {
    next();
  }
};

Auth.prototype.isAdmin = function(req, res, next) {
  if (req.isAuthenticated() &&
    (req.user.role == "admin" || req.user.role == "superAdmin")) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = new Auth();
