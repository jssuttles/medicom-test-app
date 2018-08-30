const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');
const fs = require('fs');

const logger = require('./modules/logger');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const logDirectory = './logs';

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const loggedError = new Error(err.message);
  loggedError.status = err.status || 500;
  loggedError.stack = err.stack;
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(loggedError.status);
  res.render('error');

  loggedError.url = req.originalUrl;
  loggedError.method = req.method;

  logger.error(loggedError);
});

module.exports = app;
