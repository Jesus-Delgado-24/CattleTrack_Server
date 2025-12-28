const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;

router.post('', async (req, res) => {
    const { id_sector, cantidad } = req.body;
  
    // Validación simple
    if (id_sector == null || cantidad == null) {
      return res.status(400).json({ error: 'Faltan datos: id_sector o cantidad' });
    }
  
    // Llama al procedimiento almacenado
    const query = 'CALL Registrar_Produccion_Leche(?, ?)';
    const params = [id_sector, cantidad];
    const respuesta = await db.query(query, params);
    const mensaje = respuesta?.[0]?.[0]?.[0]?.mensaje;
    return res.status(200).json({ mensaje: mensaje || 'Producción registrada exitosamente' });
  });
  module.exports = router;
  