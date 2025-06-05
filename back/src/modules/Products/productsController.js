const products = require('./productsData');
const productService = require('./productsService');

exports.getAllProducts = (req, res) => {
    const { offset = 0, limit = 10 } = req.query;
    const result = productService.getAllProducts(parseInt(offset), parseInt(limit));
    res.json(result);
};

exports.getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
};