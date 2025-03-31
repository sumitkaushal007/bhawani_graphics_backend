const express = require("express");
const router = express.Router();
const sizeUnitsController = require("../controllers/sizeUnitController.js")

router.get('/', sizeUnitsController.list)

module.exports = router;