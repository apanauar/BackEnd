import { Router } from 'express';
import ProductManager from '../service/productManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { products });
});

export default router;
