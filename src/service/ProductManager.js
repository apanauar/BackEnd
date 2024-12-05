import fs from 'fs/promises';
import path from 'path';

const productosFilePath = path.resolve('data', 'productos.json');

export default class ProductManager {
    constructor() {
        this.productos = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(productosFilePath, 'utf-8');
            this.productos = JSON.parse(data);
        } catch (error) {
            this.productos = [];
        }
    }

    async saveToFile() {
        const jsonData = JSON.stringify(this.productos, null, 2);
        await fs.writeFile(productosFilePath, jsonData);
    }

    async getAllProducts(limit) {
        if (limit) {
            return this.productos.slice(0, limit);
        }
        return this.productos;
    }

    getProductById(id) {
        return this.productos.find(producto => producto.id === id);
    }

    async addProduct(producto) {
        const newProduct = {
            id: this.productos.length ? this.productos[this.productos.length - 1].id + 1 : 1,
            ...producto,
            status: true
        };
        this.productos.push(newProduct);
        await this.saveToFile();
        const io = require('express').get('socketio');
        io.emit('update-products', this.productos);
        return newProduct;
    }

    async updateProduct(id, updateFields) {
        const productoIndex = this.productos.findIndex(producto => producto.id === id);
        if (productoIndex === -1) {
            return null;
        }
        const updatedProduct = {
            ...this.productos[productoIndex],
            ...updateFields,
            id: this.productos[productoIndex].id 
        };
        this.productos[productoIndex] = updatedProduct;
        await this.saveToFile();
        return updatedProduct;
    }

    async deleteProduct(id) {
        const productoIndex = this.productos.findIndex(producto => producto.id === id);
        if (productoIndex === -1) {
            return null;
        }
        const [deletedProduct] = this.productos.splice(productoIndex, 1); 
        await this.saveToFile();
        const io = require('express').get('socketio');
        io.emit('update-products', this.productos);
        return deletedProduct; 
    }
}
