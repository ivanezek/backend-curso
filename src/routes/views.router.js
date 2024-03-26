const Router = require('express').Router;
const socketIO = require('socket.io');
const ProductManager = require("../managers/productManager")
const viewsRouter = Router();

const productManager = new ProductManager()


function handleRealTimeProductsSocket(io) {
  io.on('connection', async(socket) => {
      console.log('Usuario conectado a la ruta /realtimeproducts');
      const products = await productManager.getProducts();
      socket.emit('products', products);
  });
}


viewsRouter.get('/', async(req, res) => {
  const products = await productManager.getProducts();
  res.status(200).render('home', { products });
});


viewsRouter.get('/realtimeproducts', async(req, res) => {
    const products = await productManager.getProducts();
    res.status(200).render('realtimeproducts', { products });
  });

  module.exports = { viewsRouter, handleRealTimeProductsSocket };