const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo administradores (Tipo_U = 2) pueden actualizar alimentos
router.put('/:id', authenticate, /*authorizeByRole([2]),*/ foodController.updateFood);

module.exports = router;
