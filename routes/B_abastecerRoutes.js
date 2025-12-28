const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Monitoreo = require('../models/Abastecer'); 

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido en MongoDB' });
    }

       const mongoDB = mongoose.connection.db;
      const d_abastecer =  await mongoDB.collection('Abastecer').findOne({ _id: new ObjectId(id) });

    if (!d_abastecer ) {
      return res.status(404).json({ error: `No se encontró ningun registro de abastecimiento con el ID ${id}` });
    }

    res.json(d_abastecer );
  } catch (error) {
    console.error('Error al buscar el monitoreo:', error);
    res.status(500).json({ error: 'Error al obtener el registro de abastecimiento' });
  }
});

module.exports = router;
