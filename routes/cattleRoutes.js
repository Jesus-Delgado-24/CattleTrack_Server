const express = require('express');
const router = express.Router();
const cattleController = require('../controllers/cattleController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo administradores (Tipo_U = 2) pueden actualizar ganado
router.put('/:id', authenticate, /*authorizeByRole([2,4]),*/ cattleController.updateCattle);

module.exports = router;
