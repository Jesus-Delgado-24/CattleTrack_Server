// src/models/diseaseModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Disease = sequelize.define('Enfermedad', {
  id_Enfermedad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre es obligatorio.' },
      notEmpty: { msg: 'El nombre no puede estar vacío.' }
    }
  },
  Tratamiento: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notNull: { msg: 'El tratamiento es obligatorio.' },
      len: {
        args: [1, 500],
        msg: 'El tratamiento debe tener entre 1 y 500 caracteres.'
      }
    }
  }
}, {
  tableName: 'Enfermedad',
  timestamps: false
});

module.exports = Disease;