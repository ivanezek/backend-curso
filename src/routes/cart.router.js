const Router = require('express').Router;
const cartRouter=Router()
const CartController = require('../controller/cart.controller');




cartRouter.get('/', CartController.getAllCarts);

// Ruta POST para crear un nuevo carrito
cartRouter.post('/', CartController.createCart);


// RUTA GET PARA CONSEGUIR EL CARRITO POR ID 
cartRouter.get('/:id', CartController.getCartById);


cartRouter.post('/:id/products', CartController.addProductToCart);

// Ruta DELETE para eliminar un producto del carrito

cartRouter.delete('/:cartId/products/:productId', CartController.removeProductFromCart);

cartRouter.put('/:cartId/products/:productId', CartController.updateProductQuantity);

cartRouter.delete('/:cartId', CartController.removeAllProductsFromCart);



module.exports = cartRouter;
