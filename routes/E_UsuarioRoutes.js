const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10); 

  try {
    const [usuario] = await pool.query('SELECT Tipo_U FROM Usuario WHERE id_Usuario = ?', [id]);

    if (usuario[0]?.Tipo_U !== '4') {
      await pool.query('DELETE FROM Usuario WHERE id_Usuario = ?', [id]);
      return res.json({
        message: 'Usuario eliminado exitosamente.',
      });
    }

    return res.status(400).json({
      message: 'No se puede eliminar a un usuario  que cumple el rol como veterinario.',
    });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({
      error: 'Error al eliminar el usuario',
      details: error.message,
    });
  }
});

module.exports = router;