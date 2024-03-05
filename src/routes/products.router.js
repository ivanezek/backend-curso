const Router = require('express').Router;
const ProductManager = require("../managers/productManager") 
const path = require('path')


const productRouter=Router()
const rutaProductos = path.join(__dirname, '../../src/data/products.json');


const productManager = new ProductManager(rutaProductos);

// METODO GET PARA OBTENER LOS PRODUCTOS
productRouter.get('/', (req, res) => {
    productManager.loadProductsFromFile();
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = productManager.getProducts().slice(0, limit);
    res.json(products);
});

productRouter.get('/:id', (req, res) => {
    const productId = req.params.id;
    try {
        const product = productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// METODO POST PARA AGREGAR UN PRODUCTO NUEVO
productRouter.post('/', (req, res) => {
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
productRouter.put('/:id', (req, res) => {
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
productRouter.delete('/:id', (req, res) => {
    const productId = req.params.id;

    try {
        productManager.deleteProduct(productId);
        res.status(204).end(); 
    }
     catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});


module.exports = productRouter;
