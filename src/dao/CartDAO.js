import Cart from '../models/Cart.js';

export default class CartDAO {
    async getById(id) {
        const cart = await Cart.findById(id).populate('products.product');
        if (!cart) throw new Error(`El carrito ${id} no existe!`);
        return cart;
    }

    async create() {
        return await Cart.create({ products: [] });
    }

    async addProduct(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        const existingIndex = cart.products.findIndex(
            item => item.product.toString() === pid
        );

        if (existingIndex >= 0) {
            cart.products[existingIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return await this.getById(cid);
    }

    async removeProduct(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        cart.products = cart.products.filter(
            item => item.product.toString() !== pid
        );

        await cart.save();
        return await this.getById(cid);
    }

    async updateProductQuantity(cid, pid, quantity) {
        if (!quantity || isNaN(parseInt(quantity))) {
            throw new Error('La cantidad ingresada no es válida!');
        }

        const cart = await Cart.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === pid
        );

        if (productIndex === -1) {
            throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);
        }

        cart.products[productIndex].quantity = parseInt(quantity);
        await cart.save();
        return await this.getById(cid);
    }

    async updateAllProducts(cid, products) {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        cart.products = products;
        await cart.save();
        return await this.getById(cid);
    }

    async clearCart(cid) {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        cart.products = [];
        await cart.save();
        return await this.getById(cid);
    }
}
