import UserDAO from '../dao/UserDAO.js';
import CartDAO from '../dao/CartDAO.js';

const userDao = new UserDAO();
const cartDao = new CartDAO();

export default class UserRepository {
    async getAll() {
        return await userDao.getAll();
    }

    async getById(id) {
        return await userDao.getById(id);
    }

    async getByEmail(email) {
        return await userDao.getByEmail(email);
    }

    async create(data) {
        // Crear carrito para el usuario
        const cart = await cartDao.create();
        data.cart = cart._id;
        return await userDao.create(data);
    }

    async update(id, data) {
        return await userDao.update(id, data);
    }

    async delete(id) {
        const user = await userDao.getById(id);
        // Eliminar carrito asociado
        if (user.cart) {
            try {
                const Cart = (await import('../models/Cart.js')).default;
                await Cart.findByIdAndDelete(user.cart._id || user.cart);
            } catch (e) {
                // Si no existe el carrito, continuar
            }
        }
        return await userDao.delete(id);
    }
}
