const Router = require('express').Router;
const path = require('path');
const socketIO = require('socket.io');
const ProductManager = require("../managers/productManager")
const viewsRouter = Router();

const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

productManager.loadProductsFromFile();

viewsRouter.get('/', (req, res) => {
  res.status(200).render('home', { products: productManager.getProducts() });
});


viewsRouter.get('/realtimeproducts', (req, res) => {
    res.status(200).render('realtimeproducts', { products: productManager.getProducts() });
  });

module.exports = viewsRouter
