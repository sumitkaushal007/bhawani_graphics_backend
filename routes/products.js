const express = require("express");
const router = express.Router();
const {authMiddleware, checkRole} = require('../middleware/auth.js');
const productController = require('../controllers/productController.js');
const productValidator = require("../validators/productValidator.js");

// Search routes (should come before parameterized routes)
router.get('/fulltext-search', productValidator.fullTextSearch, productController.fullTextSearch);

// Existing routes
router.get('/', productValidator.listProducts, productController.list);
router.post('/add', productValidator.addProduct, productController.add);
router.get('/:id', productValidator.getProduct, productController.get);
router.put('/:id', productValidator.updateProduct, productController.put);
router.delete('/:id', productValidator.getProduct, productController.delete);

module.exports = router;