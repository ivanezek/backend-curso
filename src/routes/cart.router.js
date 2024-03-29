const Router = require('express').Router;
const CartManager = require("../managers/cartManager") 
const cartRouter=Router()

const cartManager = new CartManager();


cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta POST para crear un nuevo carrito
cartRouter.post('/', async (req, res) => {
    const initialProducts = req.body.products || []; // Puedes enviar un array de productos en el cuerpo de la solicitud si es necesario
    try {
        const newCart = await cartManager.createCart(initialProducts);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// RUTA GET PARA CONSEGUIR EL CARRITO POR ID 
cartRouter.get('/:id', async (req, res) => {
    const cartId = req.params.id;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


cartRouter.post('/:id/products', async (req, res) => {
    const cartId = req.params.id;
    const productId = req.body.productId; // El ID del producto a agregar se espera en el cuerpo de la solicitud

    try {
        const addedProduct = await cartManager.addProductToCart(cartId, productId);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});



module.exports = cartRouter;
