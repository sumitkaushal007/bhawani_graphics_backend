const express = require('express');
const router = express.Router();
const clientsController = require("../controllers/clientController");
const {
  validateClientCreate,
  validateClientUpdate
} = require("../validators/clientValidator");

router.post('/add', validateClientCreate, clientsController.createClient);

router.get('/', clientsController.getAllClients);

router.get('/:id', clientsController.getClientById);

router.put('/:id', validateClientUpdate, clientsController.updateClient);

router.delete('/:id', clientsController.deleteClient);

module.exports = router;