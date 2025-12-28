const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [sector] = await pool.query('SELECT * FROM Sector WHERE id_Sector= ?', [id]);
    if (sector.length === 0) {
        return res.status(404).json({ error: `No se encontró ningun sector registrado con el ID ${id}` });
      }
    res.json(sector);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la informacion del sector' });
  }
});

module.exports = router;