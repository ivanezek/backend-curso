const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.carts = [];
    this.path = filePath;
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);

    if (!cart) {
        console.error(`Error: Carrito no encontrado para el ID ${cartId}`);
        throw new Error('Error: Carrito no encontrado');
    }

    const existingProduct = cart.products.find(product => product.id === productId);

    if (existingProduct) {
        // Si el producto ya existe, incrementar la cantidad
        existingProduct.quantity++;
    } else {
        // Si el producto no existe, agregarlo al carrito con cantidad 1
        const newProduct = {
            id: productId,
            quantity: 1,
        };

        cart.products.push(newProduct);
    }

    this.saveCartsToFile();

    // Devolver el producto agregado o actualizado
    return cart.products.find(product => product.id === productId);
}
  generateCartId() {
    return Date.now().toString(); 
  }

  getCartById(cartId) {
    return this.carts.find(cart => cart.id === cartId);
  }

  createCart(initialProducts = []) {
    const cartId = this.generateCartId();
    const newCart = {
      id: cartId,
      products: initialProducts.map(product => ({ ...product })), 
    };

    this.carts.push(newCart);
    this.saveCartsToFile();

    return newCart;
  }


  saveCartsToFile() {
    const data = JSON.stringify(this.carts, null, 2);

    fs.writeFileSync(this.path, data, 'utf8');
    console.log(`Carritos guardados en el archivo ${this.path}`);
  }

  loadCartsFromFile() {
    try {
        const data = fs.readFileSync(this.path, 'utf8');
        this.carts = JSON.parse(data);
        console.log(`Carritos cargados desde el archivo ${this.path}`, this.carts);
    } catch (error) {
        console.error(`Error al cargar los carritos desde el archivo ${this.path}:`, error.message);
    }
    }
}

module.exports = CartManager;