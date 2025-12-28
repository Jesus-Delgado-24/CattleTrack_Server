const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Cattle = sequelize.define('Ganado', {
  id_Ganado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_Sector: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sector',
      key: 'id_Sector'
    }
  },
  Genero: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: [['H', 'M']] // Solo permite 'H' (Hembra) o 'M' (Macho)
    }
  },
  Peso: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0 // Peso no negativo
    }
  },
  Fecha_Nacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Ganado',
  timestamps: false
});

module.exports = Cattle;