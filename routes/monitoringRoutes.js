
const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const authenticate = require('../middleware/jwtAuth'); // Middleware de autenticación JWT
const authorizeByRole = require('../middleware/authorizeByRole'); // Middleware de autorización por tipo de usuario

// Solo trabajadores (Tipo_U = 3) pueden actualizar monitoreos
router.put('/:id', authenticate, /*authorizeByRole([3]),*/ monitoringController.updateMonitoring);

module.exports = router;
