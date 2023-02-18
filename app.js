const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const timeout = require('connect-timeout');

const authorize = require('./middleware/authorize');

const todos = require('./routes/todo');
const users = require('./routes/user');

const app = express();

app.use(timeout('180s'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(haltOnTimedOut);

app.use('/todos', authorize, todos);
app.use('/users', users);

function haltOnTimedOut (req, res, next) {
  if (!req.timedout) next()
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
