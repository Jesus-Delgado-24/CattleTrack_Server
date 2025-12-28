const express = require('express');
const router = express.Router();
const { pool} = require('../config/database');
const mongoose = require('mongoose');

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
     const mongoDB = mongoose.connection.db;
    const historial_abastece =  await mongoDB.collection('Abastecer').findOne({id_Alimento: parseInt(id) });
    if (historial_abastece) {
        return res.status(400).json({ message: 'Este alimento tiene historial de abastecimiento actual y no puede eliminarse.' });
    }

    const [R_Mysql] = await pool.query('CALL Eliminar_Almacen_Alimento(?)', [id]);

    return res.json({
      message: `'Alimento eliminado exitosamente.'`,
    });

  } catch (errorm) {
    console.error('Error al eliminar:', errorm);
    return res.status(500).json({ error: 'Error al eliminar el alimento', details: errorm.message });
  }
});

module.exports = router;