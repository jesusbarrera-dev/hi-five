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

  app.get('/almacen', (req, res) => {
    res.render("./layouts/almacen");
  });

  app.get('/carrito', (req, res) => {
    res.render("./layouts/carrito");
  });

  app.get('/pago', (req, res) => {
    res.render("./layouts/pago");
  });

  app.get('/compras', (req, res) => {
    res.render("./layouts/compras");
  });

  app.get('/devolucion', (req, res) => {
    res.render("./layouts/devolucion");
  });

  // app.use((req, res, next) => {
  //   res.status(404).render("error404")
  // });
}

