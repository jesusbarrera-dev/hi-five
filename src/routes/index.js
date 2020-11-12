const { render } = require('ejs');
const express = require('express');
const router = express.Router();

module.exports = app => {

  app.get('/', (req, res) => {
    res.render("./layouts/index");
  });

  app.get('/login', (req, res) => {
    res.render("./layouts/login");
  });

  app.get('/hombre', (req, res) => {
    res.render("./layouts/hombre");
  });

  app.get('/mujer', (req, res) => {
    res.render("./layouts/mujer");
  });

  app.get('/admin', (req, res) => {
    res.render("./layouts/admin");
  });

  app.get('/registroProducto', (req, res) => {
    res.render("./layouts/registroProducto");
  });

  app.get('/registroUsuario', (req, res) => {
    res.render("./layouts/registroUsuario");
  });

  // app.use((req, res, next) => {
  //   res.status(404).render("error404")
  // });
}

