const Food = require('../models/foodModel');

exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, cantidad } = req.body;

    // Verificar si el alimento existe
    const existingFood = await Food.findByPk(id);
    if (!existingFood) {
      return res.status(404).json({ error: 'Alimento no encontrado.' });
    }

    // Actualizar (Sequelize manejará las validaciones del modelo)
    const [updatedRows] = await Food.update(
      { nombre, tipo, cantidad },
      { where: { id_Alimento: id } }
    );

    if (updatedRows === 0) {
      return res.status(200).json({ message: 'No hubo cambios en el alimento.' });
    }

    const updatedFood = await Food.findByPk(id);
    res.status(200).json({ success: true, data: updatedFood });

  } catch (error) {
    // Errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor.' });
  }
};