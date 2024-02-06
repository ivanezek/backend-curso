class ProductManager {
    constructor() {
      this.products = [];
    }
  
    generateProductId() {
      return '_' + Math.random().toString(36).substr(2, 9); 
    }
  
    getProducts() {
      return this.products;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      // Verifica si el código ya está en uso
      const isCodeUnique = this.products.every(product => product.code !== code);
  
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
  }
  
  // uso del ProductManager
  const productManager = new ProductManager();
  
  console.log(productManager.getProducts()); // getProducts devuelve array vacio
  
  const newProduct = productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
  console.log(productManager.getProducts()); // se agrega el producto
  

  try {
    productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
  } catch (error) {
    console.error(error.message); // código del producto ya fue usado
  }
  
  const retrievedProduct = productManager.getProductById(newProduct.id);
  console.log(retrievedProduct); 
  
  // producto que no existe lanza error
  try {
    productManager.getProductById('nonExistentId');
  } catch (error) {
    console.error(error.message); 
  }
  