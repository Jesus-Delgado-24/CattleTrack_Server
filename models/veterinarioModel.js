const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Veterinario = sequelize.define('Veterinario', {
  id_Veterinario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'id_Usuario'
    }
  },
  id_Sector: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sector',
      key: 'id_Sector'
    }
  },
  Especialidad: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La especialidad no puede estar vacía' }
    }
  }
}, {
  tableName: 'Veterinario',
  timestamps: false
});

module.exports = Veterinario;