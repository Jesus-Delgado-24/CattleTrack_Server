const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [usuario] = await pool.query('SELECT * FROM Usuario WHERE id_usuario= ?', [id]);
    if (usuario.length === 0) {
        return res.status(404).json({ error: `No se encontró ningun usuario con el ID ${id}` });
      }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la informacion del usuario' });
  }
});

module.exports = router;