const Router = require('express').Router;
const socketIO = require('socket.io');
const ProductManager = require("../managers/productManager")
const viewsRouter = Router();
const { modeloProductos } = require('../dao/models/productos.modelo'); 


const productManager = new ProductManager()


function handleRealTimeProductsSocket(io) {
  io.on('connection', async(socket) => {
      console.log('Usuario conectado a la ruta /realtimeproducts');
      const products = await productManager.getProducts();
      socket.emit('products', products);
  });
}


viewsRouter.get('/', async(req, res) => {
  res.status(200).render('home');
});

viewsRouter.get('/products', async(req, res) => {
  let {pagina}=req.query
  if(!pagina){
      pagina=1
  }

  let {
      docs:products,
      totalPages, 
      prevPage, nextPage, 
      hasPrevPage, hasNextPage
  } = await modeloProductos.paginate({},{limit:2, page:pagina, lean:true})

  res.status(200).render('products', { products, totalPages, 
    prevPage, nextPage, 
    hasPrevPage, hasNextPage });
});


viewsRouter.get('/realtimeproducts', async(req, res) => {
    const products = await productManager.getProducts();
    res.status(200).render('realtimeproducts', { products });
  });

  module.exports = { viewsRouter, handleRealTimeProductsSocket };