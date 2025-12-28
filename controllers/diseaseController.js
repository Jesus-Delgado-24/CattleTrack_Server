// src/controllers/diseaseController.js
const Disease = require('../models/diseaseModel');

exports.updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Tratamiento } = req.body;

    // Validar campos obligatorios
    if (!Nombre || !Tratamiento) {
      return res.status(400).json({ error: 'Nombre y Tratamiento son campos obligatorios.' });
    }

    // Verificar si la enfermedad existe
    const existingDisease = await Disease.findByPk(id);
    if (!existingDisease) {
      return res.status(404).json({ error: 'Enfermedad no encontrada.' });
    }

    // Actualizar
    const [updatedRows] = await Disease.update(
      { Nombre, Tratamiento },
      { where: { id_Enfermedad: id } }
    );

    if (updatedRows === 0) {
      return res.status(200).json({ message: 'No se realizaron cambios.' });
    }

    const updatedDisease = await Disease.findByPk(id);
    res.status(200).json({ success: true, data: updatedDisease });

  } catch (error) {
    console.error('Error en updateDisease:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};