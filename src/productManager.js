const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.path = filePath;
  }

  generateProductId() {
    const nextId = this.products.length + 1;
    return nextId.toString();
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Verifica si el código ya está en uso
    const isCodeUnique = this.products.some(product => product.code === code);


    if (!isCodeUnique) {
      throw new Error('Error: El código del producto ya está en uso.');
    }

    const productId = this.generateProductId();
    const newProduct = {
      id: productId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);

    return newProduct;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (!product) {
      throw new Error('Error: Producto no encontrado.');
    }

    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      throw new Error('Error: Producto no encontrado para actualizar.');
    }

    const updatedProduct = { ...this.products[productIndex], ...updatedFields };
    
    // Actualizar el producto en el array
    this.products[productIndex] = updatedProduct;

    // Guardar productos actualizados en el archivo
    this.saveProductsToFile();

    return updatedProduct;
  }


  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      throw new Error('Error: Producto no encontrado para eliminar.');
    }

    // Eliminar el producto del array
    this.products.splice(productIndex, 1);

    this.saveProductsToFile();
  }

  saveProductsToFile() {
    const data = JSON.stringify(this.products, null, 2);

    fs.writeFileSync(this.path, data, 'utf8');
    console.log(`Productos guardados en el archivo ${this.path}`);
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      console.log(`Productos cargados desde el archivo ${this.path}`);
    } catch (error) {
      console.error(`Error al cargar los productos desde el archivo ${this.path}:`, error.message);
    }
  }
}

module.exports = ProductManager;
