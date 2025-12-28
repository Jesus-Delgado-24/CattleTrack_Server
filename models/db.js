const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

// Configuración de Sequelize (MySQL)
const sequelizeInstance = new Sequelize(
  process.env.MYSQL_DB || 'BD_CattleTrack',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/CattleTrack')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Exportamos los objetos necesarios
module.exports = {
  Sequelize,        // La clase Sequelize
  sequelize: sequelizeInstance,  // La instancia configurada
  mongoose
};