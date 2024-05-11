const { modeloCarts } = require('../dao/models/carts.modelo');
const CartManager = require("../dao/cartManager") 

const cartManager = new CartManager();

class CartController {
    // GET CARTS
    static async getAllCarts(req, res) {
        try {
            const carts = await modeloCarts.find();
            res.json(carts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // CREATE CART
    static async createCart(req, res) {
        const initialProducts = req.body.products || [];
        try {
            const newCart = await modeloCarts.create({ products: initialProducts });
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // GET CART BY ID
    static async getCartById(req, res) {
        const cartId = req.params.id;
        try {
            const cart = await modeloCarts.findById(cartId).populate({
                path: 'products.productId',
                select: 'title price description code category stock status'
            });
            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
                return;
            }
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' + error.message });
        }
    }

    // ADD PRODUCT TO CART
    static async addProductToCart(req, res) {
        const cartId = req.params.id;
        const productId = req.body.productId;


        try {
            const addedProduct = await cartManager.addProductToCart(cartId, productId);
            res.status(201).json(addedProduct);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    // DELETE PRODUCT FROM CART
    static async removeProductFromCart(req, res) {
        const { cartId, productId } = req.params;
        try {
            await cartManager.removeProductFromCart(cartId, productId);
            res.json({ message: 'Producto eliminado del carrito exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto del carrito: ' + error.message });
        }
    }

    // UPDATE QUANTITY OF PRODUCT IN CART
    static async updateProductQuantity(req, res) {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        try {
            const updatedProduct = await cartManager.updateProductQuantity(cartId, productId, quantity);
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito: ' + error.message });
        }
    }

    // DELETE CART
    static async removeAllProductsFromCart(req, res) {
        const { cartId } = req.params;
        try {
            await cartManager.removeAllProductsFromCart(cartId);
            res.json({ message: 'Carrito eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el carrito: ' + error.message });
        }
    }
}

module.exports = CartController;