import ProductRepository from './repositories/ProductRepository.js';

const productRepository = new ProductRepository();

export default (io) => {
    io.on("connection", (socket) => {

        socket.on("createProduct", async (data) => {
            try {
                await productRepository.create(data);
                const products = await productRepository.getAll({});
                socket.emit("publishProducts", products.docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                await productRepository.delete(data.pid);
                const products = await productRepository.getAll({});
                socket.emit("publishProducts", products.docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });
    });
};
