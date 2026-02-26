import User from '../models/User.js';

export default class UserDAO {
    async getAll() {
        return await User.find().select('-password').populate('cart');
    }

    async getById(id) {
        const user = await User.findById(id).populate('cart');
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async getByEmail(email) {
        return await User.findOne({ email }).populate('cart');
    }

    async create(data) {
        return await User.create(data);
    }

    async update(id, data) {
        const user = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        }).select('-password').populate('cart');
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async delete(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }
}
