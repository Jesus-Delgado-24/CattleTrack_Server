const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [ganado] = await pool.query('SELECT * FROM Ganado WHERE id_ganado= ?', [id]);
    if (ganado.length === 0) {
        return res.status(404).json({ error: `No se encontró ningun ganado con el ID ${id}` });
      }
    res.json(ganado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la informacion del  ganado' });
  }
});

module.exports = router;