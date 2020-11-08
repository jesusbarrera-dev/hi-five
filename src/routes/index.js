const express = require('express');
const router = express.Router();

module.exports = app => {

  app.get('/', (req, res) => {
    res.render("./layouts/index");
  });

  app.get('/login', (req, res) => {
    res.render("./layouts/login");
  });

  // app.use((req, res, next) => {
  //   res.status(404).render("error404")
  // });
}

