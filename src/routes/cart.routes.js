import { Router } from 'express';
import CartManager from '../service/CartManager.js'; // Importar el manejador de carritos

const router = Router();
const cartManager = new CartManager();

// Ruta para crear un carrito
router.post('/', (req, res) => {
    try {
        const newCart = cartManager.createCart();
        res.status(201).json(newCart); // Retornar el carrito recién creado
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el carrito');
    }
});

// Ruta para obtener los productos de un carrito específico
router.get('/:cid', (req, res) => {
    try {
        const cartId = parseInt(req.params.cid); // Obtener el ID del carrito
        const cart = cartManager.getCartById(cartId);
        
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.json(cart.products); // Retornar los productos del carrito
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos del carrito');
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = parseInt(req.params.cid); // ID del carrito
        const productId = parseInt(req.params.pid); // ID del producto

        const updatedCart = cartManager.addProductToCart(cartId, productId);
        
        if (!updatedCart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.json(updatedCart); // Retornar el carrito actualizado
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

export default router;
