// src/models/monitoringModel.js
const mongoose = require('mongoose');

const monitoringSchema = new mongoose.Schema({
  id_Veterinario: {
    type: Number,
    required: [true, 'El ID del veterinario es obligatorio']
  },
  id_Ganado: {
    type: Number,
    required: [true, 'El ID del animal es obligatorio']
  },
  Fecha_Hora: {
    type: Date,
    default: Date.now
  },
  Temperatura: {
    type: Number,
    min: [35, 'La temperatura no puede ser menor a 35°C'],
    max: [42, 'La temperatura no puede ser mayor a 42°C']
  },
  Frecuencia_Cardiaca: {
    type: Number,
    min: [40, 'La frecuencia cardíaca no puede ser menor a 40 lpm'],
    max: [120, 'La frecuencia cardíaca no puede ser mayor a 120 lpm']
  },
  Nivel_Deshidratacion: {
    type: String,
    enum: ['Leve', 'Moderado', 'Severo']
  },
  Desglose: {
    type: [String], // Array de strings
    default: [],    // Valor por defecto
    validate: {
      validator: function(v) {
        return v.every(item => typeof item === 'string');
      },
      message: 'Todos los elementos de Desglose deben ser strings'
    }
  },
  Historial_Enfermedades: [{
    id_Enfermedad: Number,
    Fecha_Hora: Date
  }]
}, { collection: 'Monitoreo' });

// Exportación segura
module.exports = mongoose.models.Monitoreo || mongoose.model('Monitoreo', monitoringSchema);