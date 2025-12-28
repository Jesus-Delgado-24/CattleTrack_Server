const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [enfermedad] = await pool.query('SELECT * FROM Enfermedad WHERE id_Enfermedad= ?', [id]);
    if (enfermedad.length === 0) {
        return res.status(404).json({ error: `No se encontró ninguna enfermedad con el ID ${id}` });
      }
  
    res.json(enfermedad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la busqueda de la enfermedad'});
  }
});

module.exports = router;