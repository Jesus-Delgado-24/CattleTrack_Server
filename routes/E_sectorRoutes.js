const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const mongoose = require('mongoose');

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const mongoDB = mongoose.connection.db;

    const historialAbastece = await mongoDB.collection('Abastecer').findOne({ id_Alimento: parseInt(id) });
    if (historialAbastece) {
      return res.status(400).json({ 
        message: 'Este registro está relacionado con la colección "Abastecer" y no puede eliminarse mientras existan referencias activas.' 
      });
    }

    const [ganado] = await pool.query('SELECT COUNT(*) as total FROM Ganado WHERE id_Sector = ?', [id]);
    const [leche] = await pool.query('SELECT COUNT(*) as total FROM Produccion_Leche WHERE id_Sector = ?', [id]);
    const [veterinarios] = await pool.query('SELECT COUNT(*) as total FROM Veterinario WHERE id_Sector = ?', [id]);

    if (ganado[0].total > 0 || leche[0].total > 0 || veterinarios[0].total > 0) {
      return res.status(400).json({ 
        message: 'Este registro tiene relaciones activas con las tablas "Ganado", "Leche", "Veterinarios" o "Alimento" y no puede eliminarse.' 
      });
    }


    const [R_Mysql] = await pool.query('CALL Eliminar_Sector(?)', [id]);

    return res.json({
      message: 'Registro eliminado exitosamente.',
    });
  } catch (error) {
    console.error('Error al eliminar:', error);
    return res.status(500).json({ 
      error: 'Error al eliminar el registro', 
      details: error.message 
    });
  }
});

module.exports = router;