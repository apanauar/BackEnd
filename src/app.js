import express from 'express';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import productosRoutes from './routes/productos.routes.js';
import viewsRoutes from './routes/views.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ProductManager from './service/productManager.js';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const productManager = new ProductManager();


const app = express();
const server = http.createServer(app);

// Configuración de Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
});
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/carritos', cartRoutes);
app.use('/api/productos', productosRoutes);
app.use('/', viewsRoutes);

// Configuración de Socket.IO
const io = new Server(server);
app.set('socketio', io);

// Eventos de Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('add-product', (product) => {
        const newProduct = productManager.addProduct(product);
        io.emit('update-products', productManager.productos);
        console.log('Producto agregado vía WebSocket:', newProduct);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const SERVER_PORT = 9090;
server.listen(SERVER_PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${SERVER_PORT}`);
});
