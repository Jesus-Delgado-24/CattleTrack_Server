const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const h_reproduccion = require('../models/HistorialRepro'); 

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido en MongoDB' });
    }

       const mongoDB = mongoose.connection.db;
      const d_h_reproduccion = await mongoDB.collection('Historial de Reproduccion').findOne({ _id: new ObjectId(id) });

    if (!d_h_reproduccion) {
      return res.status(404).json({ error: `No se encontró historial de reproduccion con el ID ${id}` });
    }

    res.json(d_h_reproduccion);
  } catch (error) {
    console.error('Error al buscar el historial de reproduccion:', error);
    res.status(500).json({ error: 'Error al obtener el documento de historial de reproduccion' });
  }
});

module.exports = router;
