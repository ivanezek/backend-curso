const Router = require('express').Router;
const productRouter=Router()
const ProductController = require('../controller/product.controller');

// METODO GET PARA OBTENER LOS PRODUCTOS
productRouter.get('/', ProductController.getAllProducts);

productRouter.get('/:id', ProductController.getProductById);

// METODO POST PARA AGREGAR UN PRODUCTO NUEVO
productRouter.post('/', ProductController.createProduct);

// METODO PUT PARA CAMBIAR UN PRODUCTO
productRouter.put('/:id', ProductController.updateProduct);

// METODO DELETE PARA ELIMINAR UN PRODUCTO
productRouter.delete('/:id', ProductController.deleteProduct);


module.exports = productRouter;
