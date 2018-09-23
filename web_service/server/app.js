const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const index = require('./routes/index');
const news = require('./routes/news');
const users = require('./routes/user_controller');
const errorHandler = require('./helpers/error_handler');
const jwt = require('./helpers/jwt');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/build/'));
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/', index);
app.use('/news', news);
app.use('/users', users);

// global error handler
app.use(errorHandler);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found');
});
module.exports = app;
