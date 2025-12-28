// src/controllers/sectorController.js
const Sector = require('../models/sectorModel');

exports.updateSector = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Ubicacion, Capacidad } = req.body;

    // Verificar si el sector existe
    const existingSector = await Sector.findByPk(id);
    if (!existingSector) {
      return res.status(404).json({ error: 'Sector no encontrado.' });
    }

    // Actualizar el sector (Sequelize maneja las validaciones del modelo)
    const [updatedRows] = await Sector.update(
      { Nombre, Ubicacion, Capacidad },
      { where: { id_Sector: id } }
    );

    if (updatedRows === 0) {
      return res.status(200).json({ message: 'No hubo cambios en el sector.' });
    }

    const updatedSector = await Sector.findByPk(id);
    res.status(200).json({ success: true, data: updatedSector });

  } catch (error) {
    // Manejo de errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor.' });
  }
};