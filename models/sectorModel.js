const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Sector = sequelize.define('Sector', {
  id_Sector: {
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
  Ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'La ubicación es obligatoria.' }
    }
  },
  Capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'La capacidad debe ser mayor a 0.'
      }
    }
  }
}, {
  tableName: 'Sector',
  timestamps: false
});

module.exports = Sector;