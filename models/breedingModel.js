const mongoose = require('mongoose');

const breedingSchema = new mongoose.Schema({
  id_Vaca: {
    type: Number,
    required: [true, 'El ID de la vaca es obligatorio']
  },
  id_Toro: {
    type: Number,
    required: [true, 'El ID del toro es obligatorio']
  },
  Fecha_Gestion: {
    type: Date,
    required: [true, 'La fecha de gestación es obligatoria']
  },
  Fecha_Nacimiento: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!this.Fecha_Gestion) return true;
        const gestationMilliseconds = value - this.Fecha_Gestion;
        const gestationDays = gestationMilliseconds / (1000 * 60 * 60 * 24);
        return gestationDays >= 279;
      },
      message: 'La fecha de nacimiento debe ser al menos 280 días después de la gestión (9 meses y 1 semana).'
    }
  },
  Crias_Hembras: {
    type: Number,
    min: [0, 'No puede ser negativo']
  },
  Crias_Macho: {
    type: Number,
    min: [0, 'No puede ser negativo']
  }
}, { collection: 'Historial de Reproduccion' });

// Método para actualizar el historial y manejar las crías
breedingSchema.statics.actualizarHistorial = async function(id, datos, db) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Eliminar crías existentes en MySQL
    await db.query("DELETE FROM Ganado WHERE ObjectId = ?", [id]);
    
    // 2. Actualizar el historial en MongoDB
    const historialActualizado = await this.findByIdAndUpdate(
      id, 
      {
        id_Vaca: datos.id_Vaca,
        id_Toro: datos.id_Toro,
        Fecha_Gestion: datos.Fecha_Gestion,
        Fecha_Nacimiento: datos.Fecha_Nacimiento,
        Crias_Membras: datos.Crias_Hembras,
        Crias_Macho: datos.Crias_Macho
      }, 
      { new: true, session }
    );
    
    if (!historialActualizado) {
      throw new Error('Historial no encontrado');
    }
    
    // 3. Insertar nuevas crías en MySQL
    const [vaca] = await db.query("SELECT id_Sector FROM Ganado WHERE id_Ganado = ?", [datos.id_Vaca]);
    
    const totalCrías = [
      ...Array(Number(datos.Crias_hembras || 0)).fill('H'),
      ...Array(Number(datos.Crias_macho || 0)).fill('M')
    ];
    
    for (const genero of totalCrías) {
      await db.query("CALL Insertar_Ganado(?, ?, ?, ?, ?)", [
        vaca[0].id_Sector, 
        genero, 
        0, 
        datos.Fecha_Nacimiento, 
        id.toString()
      ]);
    }
    
    await session.commitTransaction();
    return historialActualizado;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = mongoose.model('Breeding', breedingSchema);