// middleware/validateReferences.js
const { sequelize } = require('../models/db');

exports.validateCattleExists = async (req, res, next) => {
  const cattle = await sequelize.models.Ganado.findByPk(req.body.id_Ganado);
  if (!cattle) {
    return res.status(400).json({ error: 'El ganado especificado no existe' });
  }
  next();
};

exports.validateVetExists = async (req, res, next) => {
  const vet = await sequelize.models.Veterinario.findByPk(req.body.id_Veterinario);
  if (!vet) {
    return res.status(400).json({ error: 'El veterinario especificado no existe' });
  }
  next();
};