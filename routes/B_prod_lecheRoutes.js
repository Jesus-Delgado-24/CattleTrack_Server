const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [p_leche] = await pool.query('SELECT * FROM Produccion_leche WHERE id_L= ?', [id]);
    if (p_leche.length === 0) {
        return res.status(404).json({ error: `No se encontró ninguna produccion de leche con el ID ${id}` });
      }
    res.json(p_leche);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la informacion de la produccion de leche' });
  }
});

module.exports = router;