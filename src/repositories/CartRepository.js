import CartDAO from '../dao/CartDAO.js';
import ProductDAO from '../dao/ProductDAO.js';
import TicketDAO from '../dao/TicketDAO.js';

const cartDao = new CartDAO();
const productDao = new ProductDAO();
const ticketDao = new TicketDAO();

export default class CartRepository {
    async getById(id) {
        return await cartDao.getById(id);
    }

    async create() {
        return await cartDao.create();
    }

    async addProduct(cid, pid) {
        // Validar que el producto existe
        await productDao.getById(pid);
        return await cartDao.addProduct(cid, pid);
    }

    async removeProduct(cid, pid) {
        return await cartDao.removeProduct(cid, pid);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await cartDao.updateProductQuantity(cid, pid, quantity);
    }

    async updateAllProducts(cid, products) {
        // Validar que todos los productos existen
        for (const item of products) {
            await productDao.getById(item.product);
        }
        return await cartDao.updateAllProducts(cid, products);
    }

    async clearCart(cid) {
        return await cartDao.clearCart(cid);
    }

    /**
     * Lógica de compra del carrito
     * 1. Obtener carrito con productos populados
     * 2. Verificar stock de cada producto
     * 3. Los que tienen stock: restar stock, sumar al total
     * 4. Los que NO tienen stock: quedan en el carrito
     * 5. Crear Ticket con el total y email del comprador
     * 6. Devolver ticket + IDs de productos sin stock
     */
    async purchase(cid, purchaserEmail) {
        const cart = await cartDao.getById(cid);

        if (!cart.products.length) {
            throw new Error('El carrito está vacío');
        }

        let totalAmount = 0;
        const productsNotProcessed = [];
        const productsProcessed = [];

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                // Hay stock suficiente: procesar
                product.stock -= item.quantity;
                await productDao.update(product._id, { stock: product.stock });
                totalAmount += product.price * item.quantity;
                productsProcessed.push(item);
            } else {
                // No hay stock suficiente: no procesar
                productsNotProcessed.push(product._id);
            }
        }

        if (productsProcessed.length === 0) {
            throw new Error('Ningún producto del carrito tiene stock suficiente');
        }

        // Crear ticket
        const ticket = await ticketDao.create({
            amount: totalAmount,
            purchaser: purchaserEmail
        });

        // Dejar en el carrito solo los productos no procesados
        const remainingProducts = cart.products.filter(item =>
            productsNotProcessed.some(id => id.toString() === item.product._id.toString())
        );

        await cartDao.updateAllProducts(cid, remainingProducts.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        })));

        return {
            ticket,
            productsNotProcessed
        };
    }
}
