'use strict';

var dotenv = require('dotenv');
var express = require('express');
var session = require('express-session');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var request = require('request');
var auth = require('./server/helpers/authorisation');

dotenv.load();

let server;
let expressApp = express();

const port = normalizePort(process.env.PORT || '3456');

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

var ApiServer = function() {
};

ApiServer.prototype.startServer = function() {

  expressApp.use(favicon(path.join(__dirname, 'ui/public', 'favicon.ico')));
  expressApp.use(logger('dev'));
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(cookieParser());
  expressApp.use(session({
    secret: 'dkdksdkiwikdkkdialalal737373',
    resave: true,
    saveUninitialized: true
  }));
  expressApp.use(express.static(path.join(__dirname, 'ui')));

  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  expressApp.use('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  expressApp.use('/api/swimdata', auth.isAuth, require('./server/routes/swimdata'));
  expressApp.use('/api/results', auth.isAuth, require('./server/routes/results'));
  expressApp.use('/api/meets', auth.isAuth, require('./server/routes/meets'));
  expressApp.use('/api/entries', auth.isAuth, require('./server/routes/entries'));
  expressApp.use('/api/clubs', auth.isAdmin, require('./server/routes/clubs'));
  expressApp.use('/api/swimmers', auth.isAuth, require('./server/routes/swimmers'));
  expressApp.use('/api/swimtimes', auth.isAuth, require('./server/routes/swimtimes'));
  expressApp.use('/api/asa', auth.isAuth, require('./server/routes/asa'));
  expressApp.use('/api/timesheets', auth.isAuth, require('./server/routes/timesheets'));
  expressApp.use('/api/users', auth.isAdmin, require('./server/routes/users'));
  expressApp.use('/api', function(req, res) {
    if(req.isAuthenticated()) {
      res.send(req.user);
    } else {
      res.sendStatus(401);
    }
  });

  expressApp.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
  expressApp.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/api' }),
    function(req, res) {
      console.log(req.user);
      res.redirect('/');
    });

  // catch 404 and forward to error handler
  expressApp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (expressApp.get('env') === 'development') {
    expressApp.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err.stack
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  expressApp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
  });

  server = http.createServer(expressApp);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

ApiServer.prototype.close = function() {
  server.close();
}

module.exports = ApiServer;
