const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [alimento] = await pool.query('SELECT * FROM almacen_alimento WHERE id_Alimento= ?', [id]);
    if (alimento.length === 0) {
        return res.status(404).json({ error: `No se encontró ningun alimento registrado con el ID ${id}` });
      }
    res.json(alimento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la informacion del alimento' });
  }
});

module.exports = router;