
const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo administradores (Tipo_U = 2) pueden actualizar veterinarios
router.put('/:id', authenticate, /* authorizeByRole([2]), */ vetController.updateVet);

module.exports = router;
