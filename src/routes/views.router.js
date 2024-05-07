const Router = require('express').Router;
const socketIO = require('socket.io');
const ProductManager = require("../dao/productManager")
const viewsRouter = Router();
const { modeloProductos } = require('../dao/models/productos.modelo'); 
const { modeloCarts } = require('../dao/models/carts.modelo');
const UserManager = require('../dao/userManager');

let userManager = new UserManager();



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
            console.error('Error al obtener información del usuario:', error);
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
});



// Ruta para mostrar los detalles de un producto
viewsRouter.get('/products/:id', async (req, res) => {
  try {
      const productId = req.params.id;
      const product = await modeloProductos.findById(productId).lean();
      if (!product) {
          return res.status(404).send('El producto no fue encontrado.');
      }
      res.render('singleproduct', { product });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar la solicitud.');
  }
});



// VISTA DEL CART
viewsRouter.get('/cart/:id', async (req, res) => {
  try {
      const cartId = req.params.id;
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
      console.error(error);
      res.status(500).send('Error al procesar la solicitud.');
  }
});

// VISTA LOGIN
viewsRouter.get('/login', async(req, res) => {
    let {message, error} = req.query;
  res.status(200).render('login', {message, error});
});

// VISTA Register
viewsRouter.get('/register', async(req, res) => {

    let {message, error} = req.query;
  res.status(200).render('register', {message, error});
});

// PROFILE PAGE VIEW
viewsRouter.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('profile', { user: req.session.user });
  });

viewsRouter.get('/realtimeproducts', async(req, res) => {
    const products = await productManager.getProducts();
    res.status(200).render('realtimeproducts', { products });
  });

  module.exports = { viewsRouter, handleRealTimeProductsSocket };