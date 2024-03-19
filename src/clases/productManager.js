const { clearScreenDown } = require('readline');

const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.nextId = 1;
        this.path = filePath;
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.nextId = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
            console.log('Productos guardados correctamente.');
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }
    

    async addProduct(product) {
        // Verificar que se proporciona un objeto producto
        if (!product || typeof product !== 'object') {
            console.log("Se requiere un objeto producto.");
            return;
        }
    
        const { title, description, code, price, status, stock, category, thumbnails } = product;
    
        // Verificar que todos los campos obligatorios estén presentes
        if (!title || !description || !code || !price || !status || !stock || !category) {
            console.log("Todos los campos son obligatorios.");
            return;
        }
    
        // Verificar si el código de producto ya existe
        if (this.products.some(existingProduct => existingProduct.code === code)) {
            console.log("El código de producto ya existe.");
            return;
        }
    
        // Generar el nuevo ID del producto
        const id = this.nextId++;
    
        // Crear el nuevo producto
        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails: thumbnails || [],
        };
    
        // Agregar el nuevo producto al array de productos
        this.products.push(newProduct);
    
        // Guardar los productos actualizados
        await this.saveProducts();
    
        console.log("Producto agregado correctamente:", newProduct);
    }
    

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProducts();
            console.log("Producto eliminado correctamente.");
        } else {
            console.log("Producto no encontrado.");
        }
    }

    async updateProduct(id, fieldToUpdate, value) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            if (fieldToUpdate !== 'id') { 
                product[fieldToUpdate] = value;
                await this.saveProducts();
                console.log("Producto actualizado correctamente.");
            } else {
                console.log("No se puede modificar el ID del producto.");
            }
        } else {
            console.log("Producto no encontrado.");
        }
    }

    async getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado.");
        }
    }

    async getProducts() {
        return this.products;
    }
}




module.exports = ProductManager;
