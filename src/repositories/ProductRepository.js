import ProductDAO from '../dao/ProductDAO.js';

const dao = new ProductDAO();

export default class ProductRepository {
    async getAll(params) {
        return await dao.getAll(params);
    }

    async getById(id) {
        return await dao.getById(id);
    }

    async create(data) {
        return await dao.create(data);
    }

    async update(id, data) {
        return await dao.update(id, data);
    }

    async delete(id) {
        return await dao.delete(id);
    }
}
