const express = require("express");
const router = express.Router();
const {authMiddleware, checkRole} = require('../middleware/auth.js');
const productController = require('../controllers/productController.js');
const productValidator = require("../validators/productValidator.js");

// router.use(authMiddleware);
// router.use(checkRole(["admin"]));

router.get('/', productController.list);
router.post('/add', productValidator.addProduct, productController.add);
router.get('/:id', productValidator.getProduct, productController.get);
router.put('/:id', productValidator.updateProduct, productController.put);



module.exports = router;