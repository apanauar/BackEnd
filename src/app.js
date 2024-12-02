import express from 'express'
import productosRoutes from './routes/productos.routes.js'
import cartRoutes from './routes/cart.routes.js'





const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/carritos', cartRoutes);

app.use('/api/productos', productosRoutes)

const SERVER_PORT = 9090
app.listen(SERVER_PORT, () =>{
    console.log("el servidor esta en " + SERVER_PORT);
    
})