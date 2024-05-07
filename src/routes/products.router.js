const Router = require('express').Router;
const ProductManager = require("../dao/productManager")
const { modeloProductos } = require('../dao/models/productos.modelo'); 
const productRouter=Router()

const productManager = new ProductManager()

// METODO GET PARA OBTENER LOS PRODUCTOS
productRouter.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        };
        const products = await modeloProductos.paginate({}, options);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// METODO POST PARA AGREGAR UN PRODUCTO NUEVO
productRouter.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;

    try {
        const newProduct = await productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        );
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// METODO PUT PARA CAMBIAR UN PRODUCTO
productRouter.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedFields = req.body;

    try {
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// METODO DELETE PARA ELIMINAR UN PRODUCTO
productRouter.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        await productManager.deleteProduct(productId);
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});


module.exports = productRouter;
