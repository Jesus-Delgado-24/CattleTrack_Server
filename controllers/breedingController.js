const mongoose = require('mongoose'); // Esta línea es crucial
const Breeding = require('../models/breedingModel');
const Ganado = require('../models/cattleModel');
const db = require('../config/database').pool;

exports.updateBreeding = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_Vaca, id_Toro, Fecha_Gestion, Fecha_Nacimiento, Crias_Hembras, Crias_Macho } = req.body;

    // Validar ObjectId (requiere mongoose)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de historial no válido' });
    }

    // Validar vaca y toro
    if (id_Vaca) {
      const vacaExists = await Ganado.findByPk(id_Vaca);
      if (!vacaExists || vacaExists.Genero !== 'H') {
        return res.status(400).json({ error: 'La vaca no existe o no es hembra.' });
      }
    }

    if (id_Toro) {
      const toroExists = await Ganado.findByPk(id_Toro);
      if (!toroExists || toroExists.Genero !== 'M') {
        return res.status(400).json({ error: 'El toro no existe o no es macho.' });
      }
    }

    // 1. Eliminar crías existentes
    await db.query("DELETE FROM Ganado WHERE ObjectId = ?", [id]);

    // 2. Actualizar en MongoDB
    const updatedBreeding = await Breeding.findByIdAndUpdate(
      id,
      { 
        id_Vaca, 
        id_Toro, 
        Fecha_Gestion, 
        Fecha_Nacimiento, 
        Crias_Hembras: Crias_Hembras || 0, 
        Crias_Macho: Crias_Macho || 0 
      },
      { new: true, runValidators: true }
    );

    if (!updatedBreeding) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    // 3. Insertar nuevas crías
    const [vaca] = await db.query("SELECT id_Sector FROM Ganado WHERE id_Ganado = ?", [id_Vaca]);
    
    const totalCrías = [
      ...Array(Number(Crias_Hembras || 0)).fill('H'),
      ...Array(Number(Crias_Macho || 0)).fill('M')
    ];

    for (const genero of totalCrías) {
      await db.query("CALL Insertar_Ganado(?, ?, ?, ?, ?)", [
        vaca[0].id_Sector, 
        genero, 
        0, 
        Fecha_Nacimiento, 
        id.toString()
      ]);
    }

    res.status(200).json({
      success: true,
      message: 'Historial y crías actualizadas correctamente',
      data: updatedBreeding
    });

  } catch (error) {
    console.error('Error en updateBreeding:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error interno del servidor'
    });
  }
};