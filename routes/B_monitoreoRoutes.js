const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Monitoreo = require('../models/monitoringModel'); 
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido en MongoDB' });
    }

       const mongoDB = mongoose.connection.db;
      const d_monitoreo =  await mongoDB.collection('Monitoreo').findOne({ _id: new ObjectId(id) });

    if (!d_monitoreo) {
      return res.status(404).json({ error: `No se encontró monitoreo con el ID ${id}` });
    }

    res.json(d_monitoreo);
  } catch (error) {
    console.error('Error al buscar el monitoreo:', error);
    res.status(500).json({ error: 'Error al obtener el documento de Monitoreo' });
  }
});

module.exports = router;
