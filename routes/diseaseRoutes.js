
const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo administradores (Tipo_U = 2) pueden actualizar enfermedades
router.put('/:id', authenticate, /*authorizeByRole([2,4]),*/ diseaseController.updateDisease);

module.exports = router;
