const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;
const Abastecer = require('../models/Abastecer');

router.post('', async (req, res, next) => {
    try {
      const { id_Sector, id_Alimento, Cantidad } = req.body;
      if (id_Sector == null || id_Alimento == null || Cantidad == null) {
        return res.status(400).json({ mensaje: 'Faltan datos' });
      }
  
      // 1) Checar stock en MySQL
      const [rows] = await db.query(
        'SELECT Cantidad FROM almacen_alimento WHERE Id_Alimento = ?',
        [id_Alimento]
      );
      if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Alimento no encontrado' });
      }
      const stock = rows[0].Cantidad;
      if (Cantidad > stock) {
        return res.status(400).json({ mensaje: 'Stock insuficiente' });
      }
  
      // 2) Registrar en Mongo
      const fecha_hora = new Date();
      const doc = await new Abastecer({
        id_Sector,
        id_Alimento,
        Cantidad,
        Fecha_hora: fecha_hora
      }).save();
  
      // 3) Descontar stock en MySQL
      await db.query(
        'UPDATE almacen_alimento SET Cantidad = ? WHERE Id_Alimento = ?',
        [stock - Cantidad, id_Alimento]
      );
  
      res.status(201).json({ mensaje: 'Abastecimiento registro exitoso', doc });
    } catch (err) {
      next(err);
    }
  });
  
  // —–– Manejador global de errores —
  router.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  });

  module.exports = router;