// models/supplyModel.js
const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
  id_Sector: {
    type: Number,
    required: [true, 'El ID del sector es obligatorio']
  },
  id_Alimento: {
    type: Number,
    required: [true, 'El ID del alimento es obligatorio']
  },
  Fecha_hora: {
    type: Date,
    default: Date.now
  },
  Cantidad: {
    type: Number,
    min: [1, 'La cantidad debe ser al menos 1']
  }
}, { collection: 'Abastecer' });

module.exports = mongoose.model('Supply', supplySchema);