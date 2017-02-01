import dotenv from 'dotenv';
import passport from 'passport';
import request from 'request';
import GoogleStrategy from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import UserService from './users';

const Models = require('../models');
const User = Models.User;

const userService = new UserService();

dotenv.load();

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'changemeforproduction';
const BEARER_PREFIX = "Bearer ";
const AUTHENTICATION_ENABLED = process.env.AUTHENTICATION_ENABLED || true;

var strategy = new GoogleStrategy.Strategy({
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
        role: 'user',
        access_key_id: userService.generateId(),
        access_key_secret: userService.generateSecret()
      }
    }).spread(function(user, created) {
      done(null, user);
    });
  }
);

passport.use(strategy);
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

export default class AuthService {
  isAuth(req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    } else {
      res.locals.user = req.user;
      next();
    }
  }

  isAdmin(req, res, next) {
    if (req.isAuthenticated() &&
      (req.user.role == "admin" || req.user.role == "superAdmin")) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  isAuthApi(req, res, next) {
    if(AUTHENTICATION_ENABLED) {
      let token = req.body.token || req.query.token
                    || req.headers['x-access-token']
                    || req.headers['Authorization']
                    || req.headers['authorization'];

      if (token) {
        if(token.startsWith(BEARER_PREFIX)) {
          token = token.substring(BEARER_PREFIX.length);
        }

        jwt.verify(token, TOKEN_SECRET, function(err, decoded) {
          if (err) {
            return res.status(401).send({
              status: "ERROR",
              message: 'Failed to authenticate token.',
              error: 'invalid_token'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.status(401).send({
            status: "ERROR",
            message: 'No token provided.',
            error: 'invalid_token'
        });
      }
    } else {
      next();
    }
  }
}
