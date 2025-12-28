const Cattle = require('../models/cattleModel');
const Sector = require('../models/sectorModel');

exports.updateCattle = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_Sector, Genero, Peso, Fecha_Nacimiento } = req.body;

    // Validar campos obligatorios
    if (!Genero || !Peso || !Fecha_Nacimiento) {
      return res.status(400).json({ error: 'Genero, Peso y Fecha_Nacimiento son campos obligatorios.' });
    }

    // Verificar si el animal existe
    const existingCattle = await Cattle.findByPk(id);
    if (!existingCattle) {
      return res.status(404).json({ error: 'Animal no encontrado.' });
    }

    // Validar que el sector exista (si se envía id_Sector)
    if (id_Sector) {
      const sectorExists = await Sector.findByPk(id_Sector);
      if (!sectorExists) {
        return res.status(400).json({ error: 'El sector especificado no existe.' });
      }
    }

    // Actualizar el animal
    const [updatedRows] = await Cattle.update(
      { id_Sector, Genero, Peso, Fecha_Nacimiento },
      { where: { id_Ganado: id } }
    );

    if (updatedRows === 0) {
      return res.status(200).json({ message: 'No se realizaron cambios.' });
    }

    const updatedCattle = await Cattle.findByPk(id);
    res.status(200).json({ success: true, data: updatedCattle });

  } catch (error) {
    console.error('Error en updateCattle:', error);
    
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