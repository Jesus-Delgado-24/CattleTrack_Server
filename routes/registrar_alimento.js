const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;

router.post('', async (req, res) => {
    const { Nombre, Tipo, Cantidad } = req.body;

    // Validaciones en el backend
    if (!Nombre || !Tipo || Cantidad == null) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const tiposPermitidos = ['Forraje', 'Grano', 'Suplemento'];
    if (!tiposPermitidos.includes(Tipo)) {
        return res.status(400).json({ mensaje: 'El tipo debe ser Forraje, Grano o Suplemento' });
    }

    if (typeof Cantidad !== 'number' || Cantidad <= 0) {
        return res.status(400).json({ mensaje: 'La cantidad debe ser un número mayor que cero' });
    }

    // Llamar al procedimiento almacenado
    const query = 'CALL Insertar_Alimento(?, ?, ?)';
    const params = [Nombre, Tipo, Cantidad];
    const respuesta = await db.query(query, params);
    const mensaje = respuesta?.[0]?.[0]?.[0]?.mensaje;
    return res.status(200).json({ mensaje: mensaje || 'Operación completada' });
});

module.exports = router;