const CartManager = require("../dao/cartManager") 

class CartService{
    constructor(){
        this.cartManager = new CartManager()
    }

    async addProductToCart(cartId, productId){
        return await this.cartManager.addProductToCart(cartId, productId)
    }

    async getAllCarts(){
        return await this.cartManager.getAllCarts()
    }

    async getCartById(cartId){
        return await this.cartManager.getCartById(cartId)
    }

    async createCart(initialProducts = []){
        return await this.cartManager.createCart(initialProducts)
    }

    async removeProductFromCart(cartId, productId){
        return await this.cartManager.removeProductFromCart(cartId, productId)
    }

    async updateProductQuantity(cartId, productId, quantity){
        return await this.cartManager.updateProductQuantity(cartId, productId, quantity)
    }

    async removeAllProductsFromCart(cartId){
        return await this.cartManager.removeAllProductsFromCart(cartId)
    }
}

module.exports = new CartService();