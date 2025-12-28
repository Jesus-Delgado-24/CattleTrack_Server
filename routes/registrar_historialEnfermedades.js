const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;
const Monitoreo = require('../models/monitoringModel');

router.post('/', async (req, res) => {
  const { idMonitoreo, id_Enfermedad, Fecha_Hora } = req.body;

  if (!idMonitoreo || !id_Enfermedad || !Fecha_Hora) {
    return res.status(400).json({ error: 'Faltan datos: idMonitoreo, id_Enfermedad o Fecha_Hora' });
  }

  try {
    // Validar si la enfermedad existe
    const [enfermedad] = await db.query(
      'SELECT id_Enfermedad FROM Enfermedad WHERE id_Enfermedad = ?',
      [id_Enfermedad]
    );
    if (enfermedad.length === 0) {
      return res.status(400).json({ error: 'ID de Enfermedad no existe' });
    }

    // Insertar historial en el documento correspondiente
    const updated = await Monitoreo.findByIdAndUpdate(
      idMonitoreo,
      {
        $push: {
          Historial_Enfermedades: { id_Enfermedad, Fecha_Hora }
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Monitoreo no encontrado' });
    }

    res.status(200).json({
      message: 'Historial actualizado con éxito',
      monitoreo: updated
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
