const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [veterinario] = await pool.query('SELECT * FROM Veterinario WHERE id_veterinario= ?', [id]);
    if (veterinario.length === 0) {
        return res.status(404).json({ error: `No se encontró ningun veterinario con el ID ${id}` });
      }
    res.json(veterinario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la informacion del veterinario' });
  }
});

module.exports = router;