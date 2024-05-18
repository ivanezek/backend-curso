const ProductManager = require("../dao/productManager")

class ProductService {
    constructor() {
        this.productManager = new ProductManager()
    }

    async getProducts(limit = 2) {
        return await this.productManager.getProducts(limit);
    }

    async addProduct(productData) {
        const { title, description, price, thumbnail, code, stock, status, category } = productData;
        return await this.productManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
    }

    async getProductById(id) {
        return await this.productManager.getProductById(id);
    }

    async updateProduct(id, updatedFields) {
        return await this.productManager.updateProduct(id, updatedFields);
    }

    async deleteProduct(id) {
        return await this.productManager.deleteProduct(id);
    }
}

module.exports = new ProductService();