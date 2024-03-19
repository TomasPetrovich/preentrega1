
const express = require('express');
const router = express.Router();

// Importar el fs para manejar archivos
const fs = require('fs').promises;

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        // Leer el archivo de carritos existente
        const data = await fs.readFile('carts.json', 'utf-8');
        const carts = JSON.parse(data);

        // Generar un ID único para el nuevo carrito
        let newCartId = 1;
        if (carts.length > 0) {
            const ids = carts.map(cart => cart.id);
            newCartId = Math.max(...ids) + 1;
        }

        // Crear la estructura del nuevo carrito
        const newCart = {
            id: newCartId,
            products: []
        };

        // Agregar el carrito al array de carritos
        carts.push(newCart);

        // Guardar los cambios en el archivo de carritos
        await fs.writeFile('carts.json', JSON.stringify(carts, null, 2), 'utf-8');

        res.status(201).json({ cart: newCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);

        // Leer el archivo de carritos
        const data = await fs.readFile('carts.json', 'utf-8');
        const carts = JSON.parse(data);

        // Encontrar el carrito con el ID proporcionado
        const cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json({ products: cart.products });
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ error: "Error al obtener productos del carrito" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        // Leer el archivo de carritos
        const data = await fs.readFile('carts.json', 'utf-8');
        const carts = JSON.parse(data);

        // Encontrar el carrito con el ID proporcionado
        const cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(item => item.product === productId);

        if (existingProductIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            cart.products[existingProductIndex].quantity++;
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            cart.products.push({ product: productId, quantity: 1 });
        }

        // Guardar los cambios en el archivo de carritos
        await fs.writeFile('carts.json', JSON.stringify(carts, null, 2), 'utf-8');

        res.status(201).json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});



module.exports = router;
