const Router = require('express').Router;
const CartManager = require("../managers/cartManager") 
const path = require('path')

const cartRouter=Router()
const rutaProductos = path.join(__dirname, '../../src/data/carts.json');


const cartManager = new CartManager(rutaProductos);


cartRouter.get('/', (req, res) => {
    cartManager.loadCartsFromFile();
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const carts = cartManager.getAllCarts().slice(0, limit);
    res.json(carts);
});

// Ruta POST para crear un nuevo carrito
cartRouter.post('/', (req, res) => {
    const initialProducts = req.body.products || []; // Puedes enviar un array de productos en el cuerpo de la solicitud si es necesario
    const newCart = cartManager.createCart(initialProducts);
    res.status(201).json(newCart);
});

// RUTA GET PARA CONSEGUIR EL CARRITO POR ID 
cartRouter.get('/:id', (req, res) => {
    const cartId = req.params.id;

    try {
        const cart = cartManager.getCartById(cartId);
        
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }

        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


cartRouter.post('/:id/product/:productId', (req, res) => {
    const cartId = req.params.id;
    const productId = req.params.productId;

    try {
        const addedProduct = cartManager.addProductToCart(cartId, productId);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


module.exports = cartRouter;
