const { modeloProductos } = require('../dao/models/productos.modelo'); 
const ProductService = require('../services/product.service');

class ProductController{
    // GET PRODUCTS
    static async getAllProducts(req, res) {
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
    }

    // GET PRODUCT BY ID
    static async getProductById(req, res) {
        const productId = req.params.id;
        try {
            const product = await ProductService.getProductById(productId);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    }

    // CREATE PRODUCT
    static async createProduct(req, res) {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        try {
            const newProduct = await ProductService.addProduct(
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
    }

    // UPDATE PRODUCT
    static async updateProduct(req, res) {
        const productId = req.params.id;
        const updatedFields = req.body;

        try {
            const updatedProduct = await ProductService.updateProduct(productId, updatedFields);
            res.json(updatedProduct);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    // DELETE PRODUCT
    static async deleteProduct(req, res) {
        const productId = req.params.id;
        try {
            await ProductService.deleteProduct(productId);
            res.json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;