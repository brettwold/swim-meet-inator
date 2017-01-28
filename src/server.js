import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import http from 'http';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import request from 'request';
import auth from './helpers/authorisation';

import api from './routes/api';

let server;
const expressApp = express();
const port = process.env.PORT || '3456';

dotenv.load();

class ApiServer {

  constructor() {
    expressApp.use(favicon(path.join(__dirname, '../ui/public', 'favicon.ico')));
    expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: false }));
    expressApp.use(cookieParser());
    expressApp.use(session({
      secret: 'dkdksdkiwikdkkdialalal737373',
      resave: true,
      saveUninitialized: true
    }));
    expressApp.use(express.static(path.join(__dirname, '../ui')));

    expressApp.use(passport.initialize());
    expressApp.use(passport.session());

    expressApp.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    expressApp.use('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });
    expressApp.use('/api', api);
    // expressApp.use('/api/swimdata', auth.hasToken, require('./routes/swimdata'));
    // expressApp.use('/api/meets', auth.hasToken, require('./routes/meets'));
    // expressApp.use('/api/entries', auth.hasToken, require('./routes/entries'));
    // expressApp.use('/api/clubs', auth.hasToken, require('./routes/clubs'));
    // expressApp.use('/api/swimmers', auth.hasToken, require('./routes/swimmers'));
    // expressApp.use('/api/swimtimes', auth.hasToken, require('./routes/swimtimes'));
    //
    // expressApp.use('/api/results', auth.isAdmin, require('./routes/results'));
    // expressApp.use('/api/asa', auth.isAdmin, require('./routes/asa'));
    // expressApp.use('/api/timesheets', auth.isAdmin, require('./routes/timesheets'));
    // expressApp.use('/api/users', auth.isAdmin, require('./routes/users'));
    //
    // expressApp.use('/api', function(req, res) {
    //   if(req.isAuthenticated()) {
    //     res.send(req.user);
    //   } else {
    //     res.sendStatus(401);
    //   }
    // });

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
    server.on('error', this.onError);
    server.on('listening', this.onListening);
  }

  close() {
    server.close();
  }

  onError(error) {
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

  onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }

  logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }
}

module.exports = ApiServer;
