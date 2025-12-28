const express = require('express');
const router = express.Router();
const { pool} = require('../config/database');
const mongoose = require('mongoose');

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
     const mongoDB = mongoose.connection.db;
     const historial_enfermedad = await mongoDB.collection('Monitoreo').findOne({
      "Historial_Enfermedades.id_Enfermedad": parseInt(id)
    });
    if (historial_enfermedad) {
        return res.status(400).json({ message: 'Enfermedad en observacion y seguimiento. No puede eliminarse aun' });
    }

    const [R_Mysql] = await pool.query('CALL Eliminar_Enfermedad(?)', [id]);

    return res.json({
      message: `'Registro de enfermedad eliminado exitosamente.'`,
    });

  } catch (errorm) {
    console.error('Error al eliminar:', errorm);
    return res.status(500).json({ error: 'Error al eliminar el registro de enfermedad', details: errorm.message });
  }
});

module.exports = router;