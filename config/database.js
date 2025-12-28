require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,       // ✔️ Usa MYSQL_HOST (como en .env)
  user: process.env.MYSQL_USER,       // ✔️ Usa MYSQL_USER
  password: process.env.MYSQL_PASSWORD, // ✔️ Usa MYSQL_PASSWORD
  database: process.env.MYSQL_DB,     // ✔️ Usa MYSQL_DB
  port: process.env.MYSQL_PORT        // ✔️ Usa MYSQL_PORT
});

const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectarse a MongoDB: ', error);
    process.exit(1);
  }
};

const development = {
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Jesus24.',
  database: process.env.MYSQL_DB || 'bd_cattletrack',
  host: process.env.MYSQL_HOST || 'localhost',
  dialect: 'mysql',
  logging: false
};

module.exports = {
  pool,
  conectarMongoDB,
  development
};
