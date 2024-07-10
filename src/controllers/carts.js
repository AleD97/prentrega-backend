const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'carts.json');

// Funciones de ayuda
const readFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error("Error al leer el archivo:", error);
        return [];
    }
};

const writeFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al escribir en el archivo:", error);
    }
};

// Funciones del controlador
const createCart = (req, res) => {
    const carts = readFile(filePath);
    const newCart = {
        id: carts.length ? (parseInt(carts[carts.length - 1].id) + 1).toString() : '1',
        products: []
    };
    carts.push(newCart);
    writeFile(filePath, carts);
    res.status(201).json(newCart);
};

const getCartById = (req, res) => {
    const carts = readFile(filePath);
    const cart = carts.find(c => c.id === req.params.cid);
    cart ? res.json(cart) : res.status(404).json({ error: 'Carrito no encontrado' });
};

const addProductToCart = (req, res) => {
    const carts = readFile(filePath);
    const cartIndex = carts.findIndex(c => c.id === req.params.cid);
    if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }
        writeFile(filePath, carts);
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart
};
