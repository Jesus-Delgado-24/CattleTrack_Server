const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo administradores (Tipo_U = 2) pueden actualizar usuarios
router.put('/:id', authenticate, /* authorizeByRole([2]), */ userController.updateUser);

module.exports = router;