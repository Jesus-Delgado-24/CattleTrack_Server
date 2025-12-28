const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;

router.post('/', async (req, res) => {
    const { Nombre, Ubicacion, Capacidad } = req.body;

    console.log (Nombre, Ubicacion, Capacidad);
    // Validaciones
    if (!Nombre || Nombre.trim() === '') {
        return res.status(400).json({ mensaje: 'El campo Nombre es obligatorio' });
    }

    if (!Ubicacion || Ubicacion.trim() === '') {
        return res.status(400).json({ mensaje: 'El campo Ubicacion es obligatorio' });
    }

    if (!Capacidad || isNaN(Capacidad) || Capacidad <= 0) {
        return res.status(400).json({ mensaje: 'Capacidad debe ser un número entero mayor a 0' });
    }

    // Llamar al procedimiento almacenado
    const query = 'CALL Crear_Sector(?, ?, ?)';
    const params = [Nombre, Ubicacion, Capacidad];

    const respuesta = await db.query(query, params);
    const mensaje = respuesta?.[0]?.[0]?.[0]?.mensaje;
    return res.status(200).json({ mensaje: mensaje || 'Operación completada' });

    
});

module.exports = router;
