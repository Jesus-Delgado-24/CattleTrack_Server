const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo trabajadores (Tipo_U = 3) pueden actualizar supplies
router.put('/:id', authenticate, /*authorizeByRole([3]),*/ supplyController.updateSupply);

module.exports = router;