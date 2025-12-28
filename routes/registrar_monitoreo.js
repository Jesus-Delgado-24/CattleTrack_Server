const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;
const Monitoreo = require('../models/monitoringModel');

router.post('/', async (req, res) => {
  const data = req.body;
  try {
    // Validación en MySQL
    const [ganado] = await db.query('SELECT id_Ganado FROM Ganado WHERE id_Ganado = ?', [data.id_Ganado]);
    const [vet] = await db.query('SELECT id_Veterinario FROM Veterinario WHERE id_Veterinario = ?', [data.id_Veterinario]);

    if (ganado.length === 0) return res.status(400).json({ error: 'ID de Ganado no existe' });
    if (vet.length === 0) return res.status(400).json({ error: 'ID de Veterinario no existe' });

    // Insertar en Mongo
    const nuevoMonitoreo = new Monitoreo(data);
    await nuevoMonitoreo.save();

    res.status(201).json({ message: 'Monitoreo registrado con éxito', id: nuevoMonitoreo._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
