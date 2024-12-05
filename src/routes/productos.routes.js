import { Router } from "express";
import ProductManager from "../service/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const productos = await productManager.getAllProducts(limit);
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productoId = parseInt(req.params.pid);
        const producto = await productManager.getProductById(productoId);
        if (!producto) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion, codigo, precio, stock, categoria } = req.body;
        if (!titulo || !descripcion || !codigo || !precio || !stock || !categoria) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        const newProduct = await productManager.addProduct({ titulo, descripcion, codigo, precio, stock, categoria });
        const io = req.app.get('socketio');
        io.emit('update-products', productManager.productos);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productoId = parseInt(req.params.pid);
        const updateProduct = await productManager.updateProduct(productoId, req.body);
        if (!updateProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(updateProduct);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productoId = parseInt(req.params.pid);
        const deleteProduct = await productManager.deleteProduct(productoId);
        if (!deleteProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        const io = req.app.get('socketio');
        io.emit('update-products', productManager.productos);
        res.json(deleteProduct);
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
