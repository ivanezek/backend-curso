const express = require("express");
const ProductManager = require("./productManager"); 

const PORT = 8080;
const app = express();

const productManager = new ProductManager('./src/products.json'); // 



for (let i = 0; i < 10; i++) {
    const newProduct = productManager.addProduct(
        `Producto ${i + 1}`,
        `Descripción del Producto ${i + 1}`,
        100 + i * 10, 
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

app.get('/products', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = productManager.getProducts().slice(0, limit);

    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    try {
        const product = productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
    console.log('Servidor OK en puerto', PORT);
});