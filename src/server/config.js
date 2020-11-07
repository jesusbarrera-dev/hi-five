const path = require('path');
const ejs = require('ejs');
const express = require('express');

const routes = require('../routes/index.js');

module.exports = app => {

  //settings
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  //static files
  app.use('/public', express.static(path.join(__dirname, '../public')));

  //routes
  routes(app);

  return app;
}
