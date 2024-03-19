const express = require('express');
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require('./routes/carts.router.js');

const app = express();
const PUERTO = 8080; // Puedes cambiar el puerto si lo deseas

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
});
