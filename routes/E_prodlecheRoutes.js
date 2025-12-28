const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await pool.query('SELECT * FROM Produccion_Leche WHERE id_L = ?', [id]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No se encontró el registro de producción de leche con ID ${id}.`
      });
    }

    await pool.query('DELETE FROM Produccion_Leche WHERE id_L = ?', [id]);

    return res.json({
        message: `Eliminaras La producción de leche con ID ${id} del sector asociado.`,
      message: `La producción de leche con ID ${id} ha sido eliminada exitosamente .`
    });

  } catch (err) {
    console.error('Error al eliminar:', err);
    return res.status(500).json({
      error: 'Error al eliminar el registro de producción de leche',
      details: err.message
    });
  }
});

module.exports = router;