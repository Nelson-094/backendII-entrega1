import { Router } from 'express';
import ProductRepository from '../repositories/ProductRepository.js';
import CartRepository from '../repositories/CartRepository.js';

const router = Router();
const productRepository = new ProductRepository();
const cartRepository = new CartRepository();

router.get('/products', async (req, res) => {
    const products = await productRepository.getAll(req.query);

    res.render(
        'index',
        {
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(products.docs)),
            prevLink: {
                exist: products.prevLink ? true : false,
                link: products.prevLink
            },
            nextLink: {
                exist: products.nextLink ? true : false,
                link: products.nextLink
            }
        }
    )
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productRepository.getAll(req.query);
    res.render(
        'realTimeProducts',
        {
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(products.docs))
        }
    )
});

router.get('/cart/:cid', async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);

        res.render(
            'cart',
            {
                title: 'Carrito',
                style: 'index.css',
                products: JSON.parse(JSON.stringify(cart.products))
            }
        );
    } catch (error) {
        res.render(
            'notFound',
            {
                title: 'Not Found',
                style: 'index.css'
            }
        );
    }
});

export default router;
