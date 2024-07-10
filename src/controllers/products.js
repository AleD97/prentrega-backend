const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'products.json');

// Funciones de ayuda
const readFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Funciones del controlador
const getProducts = (req, res) => {
    const products = readFile(filePath);
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
};

const getProductById = (req, res) => {
    const products = readFile(filePath);
    const product = products.find(p => p.id === req.params.pid);
    product ? res.json(product) : res.status(404).json({ error: 'Product not found' });
};

const createProduct = (req, res) => {
    const products = readFile(filePath);
    const newProduct = {
        id: products.length ? (parseInt(products[products.length - 1].id) + 1).toString() : '1',
        ...req.body,
        status: req.body.status ?? true
    };
    products.push(newProduct);
    writeFile(filePath, products);
    res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
    const products = readFile(filePath);
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex !== -1) {
        const updatedProduct = { ...products[productIndex], ...req.body };
        products[productIndex] = updatedProduct;
        writeFile(filePath, products);
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
};

const deleteProduct = (req, res) => {
    const products = readFile(filePath);
    const newProducts = products.filter(p => p.id !== req.params.pid);
    if (newProducts.length !== products.length) {
        writeFile(filePath, newProducts);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
