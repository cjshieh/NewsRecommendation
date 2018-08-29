const express = require('express');
const path = require('path');

const index = require('./routes/index');
const news = require('./routes/news');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/build/'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

// TODO: remove this after development is done.
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-with");
  next();
});

app.use('/', index);
app.use('/news', news);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found');
});

module.exports = app;
