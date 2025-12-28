
const express = require('express');
const router = express.Router();
const breedingController = require('../controllers/breedingController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT (placeholder)
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario (placeholder)

// Solo veterinarios (Tipo_U = 4) pueden actualizar breeding
router.put('/:id', authenticate, /*authorizeByRole([4]),*/ breedingController.updateBreeding);

module.exports = router;
