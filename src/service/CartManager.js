import fs from 'fs/promises';
import path from 'path';

const cartFilePath = path.resolve('data', 'carritos.json'); // Ruta donde guardar los carritos

export default class CartManager {
    constructor() {
        this.carritos = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(cartFilePath, 'utf-8');
            this.carritos = JSON.parse(data);
        } catch (error) {
            this.carritos = []; // Si no hay datos, se inicia vacío
        }
    }

    async saveToFile() {
        const jsonData = JSON.stringify(this.carritos, null, 2);
        await fs.writeFile(cartFilePath, jsonData);
    }

    // Crear un nuevo carrito
    createCart() {
        const newCart = {
            id: this.carritos.length ? this.carritos[this.carritos.length - 1].id + 1 : 1,
            products: []
        };
        this.carritos.push(newCart);
        this.saveToFile();
        return newCart;
    }

    // Obtener carrito por id
    getCartById(id) {
        return this.carritos.find(cart => cart.id === id);
    }

    // Agregar producto al carrito
    addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1; // Incrementar cantidad si ya existe
        } else {
            cart.products.push({ product: productId, quantity: 1 }); // Si no existe, agregarlo
        }

        this.saveToFile();
        return cart;
    }

    // Obtener todos los carritos
    getAllCarts() {
        return this.carritos;
    }
}
