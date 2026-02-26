import Product from '../models/Product.js';

export default class ProductDAO {
    async getAll(params = {}) {
        const paginate = {
            page: params.page ? parseInt(params.page) : 1,
            limit: params.limit ? parseInt(params.limit) : 10,
        };

        if (params.sort && (params.sort === 'asc' || params.sort === 'desc')) {
            paginate.sort = { price: params.sort };
        }

        const filter = {};
        if (params.category) filter.category = params.category;
        if (params.status !== undefined) filter.status = params.status;

        const products = await Product.paginate(filter, paginate);

        products.prevLink = products.hasPrevPage
            ? `/api/products?page=${products.prevPage}`
            : null;
        products.nextLink = products.hasNextPage
            ? `/api/products?page=${products.nextPage}`
            : null;

        if (products.prevLink && paginate.limit !== 10)
            products.prevLink += `&limit=${paginate.limit}`;
        if (products.nextLink && paginate.limit !== 10)
            products.nextLink += `&limit=${paginate.limit}`;

        if (products.prevLink && paginate.sort)
            products.prevLink += `&sort=${params.sort}`;
        if (products.nextLink && paginate.sort)
            products.nextLink += `&sort=${params.sort}`;

        return products;
    }

    async getById(id) {
        const product = await Product.findById(id);
        if (!product) throw new Error(`El producto ${id} no existe!`);
        return product;
    }

    async create(data) {
        const { title, description, code, price, stock, category, thumbnails } = data;
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Faltan campos obligatorios para crear el producto');
        }
        return await Product.create({ title, description, code, price, stock, category, thumbnails });
    }

    async update(id, data) {
        const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!product) throw new Error(`El producto ${id} no existe!`);
        return product;
    }

    async delete(id) {
        const result = await Product.findByIdAndDelete(id);
        if (!result) throw new Error(`El producto ${id} no existe!`);
        return result;
    }
}
