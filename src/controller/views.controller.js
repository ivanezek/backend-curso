const ProductManager = require("../dao/productManager")
const { modeloProductos } = require('../dao/models/productos.modelo'); 
const { modeloCarts } = require('../dao/models/carts.modelo');
const UserManager = require('../dao/userManager');
const logger = require("../utils/logger");
const mongoose = require('mongoose');
const CartService = require('../services/cart.service');
const ProductService = require('../services/product.service');
const TicketService = require('../services/ticket.service');
const userService = require("../services/user.service");


let userManager = new UserManager();

const productManager = new ProductManager()

class ViewsController{
    
    // GET HOME
    static async getHome(req, res) {
        res.status(200).render('home');
    }

    // GET PRODUCTS
    static async getProducts(req, res) {
        let { pagina } = req.query;
        if (!pagina) {
            pagina = 1;
        }

        let {
            docs: products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage
        } = await modeloProductos.paginate({}, { limit: 2, page: pagina, lean: true });

        let welcomeMessage = "";
        if (req.session.user) {
            try {
                const user = await userManager.getUserByFilter({ username: req.session.user.username });
                if (user.role === 'admin') {
                    welcomeMessage = `Bienvenido, ${user.username}. Eres un administrador.`;
                } else {
                    welcomeMessage = `Bienvenido, ${user.username}.`;
                }
            } catch (error) {
                logger.error('Error al obtener información del usuario:', error);
            }
        }

        res.status(200).render('products', {
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            welcomeMessage
        });
    }

    // GET PRODUCT BY ID
    static async getProductById(req, res) {
        try {
            const productId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).send('ID de producto inválido.');
            }
            const product = await modeloProductos.findById(productId).lean();
            if (!product) {
                return res.status(404).send('El producto no fue encontrado.');
            }
            res.render('singleproduct', { product });
        } catch (error) {
            logger.error('Error al obtener el producto:', error);
            res.status(500).send('Error al procesar la solicitud.');
        }
    }

    // GET CART BY ID
    static async getCartById(req, res) {
        try {
            const cartId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return res.status(400).send('ID de carrito inválido.');
            }
            const cart = await modeloCarts.findById(cartId).populate('products').lean();
            if (!cart) {
                return res.status(404).send('El carrito no fue encontrado.');
            }
      
            // Obtener los detalles de los productos basados en sus productId
            const productsWithDetails = await Promise.all(cart.products.map(async product => {
                const productDetails = await modeloProductos.findById(product.productId).lean();
                return {
                    ...product,
                    title: productDetails.title,
                    price: productDetails.price
                };
            }));
      
            res.render('cart', { cart: { ...cart, products: productsWithDetails } });
        } catch (error) {
            logger.error('Error al obtener el carrito:', error);
            res.status(500).send('Error al procesar la solicitud.');
        }
    }

    // LOGIN VIEW
    static async getLogin(req, res) {
        let {message, error} = req.query;
        res.status(200).render('login', {message, error});
    }

    // REGISTER VIEW
    static async getRegister(req, res) {
        let {message, error} = req.query;
        res.status(200).render('register', {message, error});
    }

    // PROFILE PAGE VIEW

    static async getProfile(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render('profile', { user: req.session.user });
    }

    // REALTIME PRODUCTS VIEW

    static async getRealtimeProducts(req, res) {
        const products = await productManager.getProducts();
        res.status(200).render('realtimeproducts', { products });
    }

    // TICKET VIEW
    static async getTicket(req, res) {
        const { cartId } = req.params;
        const userEmail = req.session.user.email;
    
        try {
            const cart = await CartService.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            let totalAmount = 0;
            const purchaseProducts = [];
    
            for (const item of cart.products) {
                const product = await ProductService.getProductById(item.productId);
    
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await ProductService.updateProduct(product._id, { stock: product.stock });
                    totalAmount += product.price * item.quantity;
                    purchaseProducts.push({
                        productId: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                } else {
                    return res.status(400).json({ error: 'No hay suficiente stock para el producto ' + product.name });
                }
            }
    
            const newTicket = await TicketService.createTicket({
                amount: totalAmount,
                purchaser: userEmail,
                products: purchaseProducts
            });
    
            await CartService.removeAllProductsFromCart(cartId);
    
            res.render('ticket', { ticket: newTicket });
        } catch (error) {
            res.status(500).json({ error: 'Error al realizar la compra: ' + error.message });
        }
    }
    static async getAdminPanel(req, res) {
        try {
            const users = await userService.getUsers();
            res.status(200).render('adminPanel', { users });
        } catch (error) {
            logger.error('Error al obtener usuarios para la vista de administración:', error);
            res.status(500).send('Error al procesar la solicitud.');
        }
    }
}

module.exports = ViewsController;