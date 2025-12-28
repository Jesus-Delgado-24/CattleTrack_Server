const express = require('express');
const router = express.Router();
const { pool} = require('../config/database');
const mongoose = require('mongoose');
module.exports = router;
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

  try {
    const mongoDB = mongoose.connection.db;

    const tieneMonitoreo = await mongoDB.collection('Monitoreo').findOne({ id_Ganado: parseInt(id) });

    const tieneHistorial = await mongoDB.collection('Historial_Reproduccion').findOne({
      $or: [{ id_Vaca: parseInt(id) }, { id_Toro: parseInt(id) }]
      });
    if (tieneMonitoreo || tieneHistorial) {
      return res.status(400).json({
        message: 'No se puede eliminar el ganado porque tiene registros relacionados en su monitoreo y en historial de reproduccion ',
      });
    }

    const [resultado] = await pool.query('DELETE FROM Ganado WHERE id_Ganado = ?', [id]);
    return res.json({
      message: 'Ganado eliminado exitosamente .',
    });
  } catch (error) {
    console.error('Error al eliminar el ganado:', error);
    return res.status(500).json({
      error: 'Error al eliminar el ganado',
      details: error.message,
    });
  }
});