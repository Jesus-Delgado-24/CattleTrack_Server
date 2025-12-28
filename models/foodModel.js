const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Food = sequelize.define('Almacen_Alimento', {
  id_Alimento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre es obligatorio.' },
      notEmpty: { msg: 'El nombre no puede estar vacío.' }
    }
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Forraje', 'Grano', 'Suplemento']],
        msg: 'Tipo inválido. Valores permitidos: Forraje, Grano, Suplemento'
      }
    }
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'La cantidad no puede ser negativa.'
      }
    }
  }
}, {
  tableName: 'Almacen_Alimento',
  timestamps: false
});

module.exports = Food;