const express = require("express");
const ProductManager = require("./productManager"); 
const CartManager = require("./cartManager")

const PORT = 8080;
const app = express();
app.use(express.json())

const productManager = new ProductManager('./src/products.json');
const cartManager = new CartManager('./src/carts.json'); // 



for (let i = 0; i < 10; i++) {
    const newProduct = productManager.addProduct(
        `Producto ${i + 1}`,
        `Descripción del Producto ${i + 1}`,
        100 + i * 10,
        true,
        `Categoria ${i + 1}`,
        `Imagen${i + 1}.jpg`,
        `CODE${i + 1}`,
        20 + i
    );
}

productManager.saveProductsToFile();

productManager.loadProductsFromFile();

app.get("/", (req, res) => {
    res.send('Servidor con Express');
});


// METODO GET PARA OBTENER LOS PRODUCTOS
app.get('/api/products', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = productManager.getProducts().slice(0, limit);

    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    try {
        const product = productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// METODO POST PARA AGREGAR UN PRODUCTO NUEVO
app.post('/api/products', (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;

    try {
        const newProduct = productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        );
        productManager.saveProductsToFile();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// METODO PUT PARA CAMBIAR UN PRODUCTO
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const updatedFields = req.body;

    try {
        const updatedProduct = productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// METODO DELETE PARA ELIMINAR UN PRODUCTO
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    try {
        productManager.deleteProduct(productId);
        res.status(204).end(); 
    }
     catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// CARRITO CONFIG

// Ruta POST para crear un nuevo carrito
app.post('/api/carts', (req, res) => {
    const initialProducts = req.body.products || []; // Puedes enviar un array de productos en el cuerpo de la solicitud si es necesario
    const newCart = cartManager.createCart(initialProducts);
    res.status(201).json(newCart);
});

// RUTA GET PARA CONSEGUIR EL CARRITO POR ID 
app.get('/api/carts/:id', (req, res) => {
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


app.post('/api/carts/:id/product/:productId', (req, res) => {
    const cartId = req.params.id;
    const productId = req.params.productId;

    try {
        const addedProduct = cartManager.addProductToCart(cartId, productId);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
    console.log('Servidor OK en puerto', PORT);
});