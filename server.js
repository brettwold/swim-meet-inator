'use strict';

var express = require('express');
var exphbs  = require('express-handlebars');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

let server;
let expressApp = express();

const port = normalizePort(process.env.PORT || '3000');

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

var ApiServer = function() {
};

var routes = require('./server/routes/index');
var results = require('./server/routes/results');
var meets = require('./server/routes/meets');

ApiServer.prototype.startServer = function() {

  // uncomment after placing your favicon in /public
  expressApp.use(favicon(path.join(__dirname, 'ui/public', 'favicon.ico')));
  expressApp.use(logger('dev'));
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(cookieParser());
  expressApp.use(express.static(path.join(__dirname, 'ui')));

  expressApp.use('/', routes);
  expressApp.use('/api/results', results);
  expressApp.use('/api/meets', meets);

  // catch 404 and forward to error handler
  expressApp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (expressApp.get('env') === 'development') {
    expressApp.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  expressApp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    res.send('Something broke!');
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
