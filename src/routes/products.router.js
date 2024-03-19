const express = require('express');
const router = express.Router();

// Importar el ProductManager o cualquier lógica necesaria para manejar productos
const ProductManager = require('../clases/productManager.js');
const productManager = new ProductManager('products.json');

// Ruta para obtener todos los productos con un límite opcional
router.get('/', async (req, res) => {
    try {
        await productManager.loadProducts();

        let products = await productManager.getProducts();

        // Verificar si se proporciona un límite de resultados
        const limit = parseInt(req.query.limit);
        if (!isNaN(limit) && limit > 0) {
            products = products.slice(0, limit);
        }

        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        await productManager.loadProducts();

        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

router.post('/', async (req, res) => {
    try {
        
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;


        // Verificar que todos los campos obligatorios estén presentes
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        // Crear el nuevo producto con un ID autogenerado
        const product = {
            id: productManager.nextId++, // Autogenerar el ID
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || [], // Si no se proporciona, inicializar como un array vacío
            status: true // Valor por defecto
        };

        // Agregar el producto al administrador de productos
        await productManager.addProduct(product);

        res.status(201).json({ product });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto" });
    }
    console.log("Body recibido:", req.body);

});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;

        // Verificar que el producto exista
        const existingProduct = await productManager.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Actualizar los campos del producto
        existingProduct.title = title;
        existingProduct.description = description;
        existingProduct.code = code;
        existingProduct.price = price;
        existingProduct.stock = stock;
        existingProduct.category = category;
        existingProduct.thumbnails = thumbnails || existingProduct.thumbnails;
        existingProduct.status = status !== undefined ? status : existingProduct.status; // Actualizar solo si se proporciona

        // Guardar los cambios en el administrador de productos
        await productManager.saveProducts();

        res.json({ product: existingProduct });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        // Verificar que el producto exista
        const existingProduct = await productManager.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Eliminar el producto del administrador de productos
        await productManager.deleteProduct(productId);

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

module.exports = router;
