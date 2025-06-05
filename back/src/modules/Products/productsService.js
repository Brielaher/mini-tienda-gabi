const products = require('./productsData');

exports.getAllProducts = (offset, limit) => {
    return products.slice(offset, offset + limit);
};