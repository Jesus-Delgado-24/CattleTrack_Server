const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;

// Ruta para registrar enfermedad
router.post('', async (req, res) => {
    const { Nombre, Tratamiento } = req.body;
  
    // Validaciones básicas
    if (!Nombre || Nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la enfermedad es obligatorio' });
    }
  
    if (!Tratamiento || Tratamiento.trim() === '') {
      return res.status(400).json({ error: 'El tratamiento es obligatorio' });
    }
  
    try {
      const [result] = await db.query('CALL Registrar_Enfermedad(?, ?)', [Nombre, Tratamiento]);
      res.json({ mensaje: 'Enfermedad registrada correctamente' });
    } catch (err) {
      console.error('Error al registrar enfermedad:', err);
      res.status(500).json({ error: err.sqlMessage || 'Error en el servidor' });
    }
  });

module.exports = router;