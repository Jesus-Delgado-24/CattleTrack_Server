
const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sectorController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo administradores (Tipo_U = 2) pueden actualizar sectores
router.put('/:id', authenticate, /*authorizeByRole([2]),*/ sectorController.updateSector);

module.exports = router;
