const Monitoring = require('../models/monitoringModel');
const { sequelize } = require('../models/db');
const Veterinario = require('../models/veterinarioModel');
const Ganado = require('../models/cattleModel');
const Enfermedad = require('../models/diseaseModel'); // Nuevo modelo importado

exports.updateMonitoring = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_Veterinario,
      id_Ganado,
      Temperatura,
      Frecuencia_Cardiaca,
      Nivel_Deshidratacion,
      Desglose,
      Historial_Enfermedades
    } = req.body;

    // Validar que el registro exista en MongoDB
    const existingMonitoring = await Monitoring.findById(id);
    if (!existingMonitoring) {
      return res.status(404).json({ error: 'Registro de monitoreo no encontrado.' });
    }

    // Validar referencias en MySQL
    if (id_Veterinario) {
      const vetExists = await Veterinario.findByPk(id_Veterinario);
      if (!vetExists) {
        return res.status(400).json({ error: 'El veterinario no existe en MySQL.' });
      }
    }

    if (id_Ganado) {
      const cattleExists = await Ganado.findByPk(id_Ganado);
      if (!cattleExists) {
        return res.status(400).json({ error: 'El animal no existe en MySQL.' });
      }
    }

    // Validar Historial_Enfermedades si está presente
    if (Historial_Enfermedades) {
      if (!Array.isArray(Historial_Enfermedades)) {
        return res.status(400).json({ error: 'Historial_Enfermedades debe ser un array.' });
      }

      // Verificar cada enfermedad en MySQL
      for (const item of Historial_Enfermedades) {
        if (!item.id_Enfermedad || !item.Fecha_Hora) {
          return res.status(400).json({ 
            error: 'Cada entrada en Historial_Enfermedades debe tener id_Enfermedad y Fecha_Hora.' 
          });
        }

        const enfermedadExists = await Enfermedad.findByPk(item.id_Enfermedad);
        if (!enfermedadExists) {
          return res.status(400).json({ 
            error: `La enfermedad con ID ${item.id_Enfermedad} no existe en MySQL.` 
          });
        }

        // Validar formato de fecha si es necesario
        if (isNaN(new Date(item.Fecha_Hora).getTime())) {
          return res.status(400).json({ 
            error: `Fecha_Hora no válida para enfermedad ID ${item.id_Enfermedad}.` 
          });
        }
      }
    }

    // Validar Desglose si está presente
    if (Desglose && !Array.isArray(Desglose)) {
      return res.status(400).json({ error: 'Desglose debe ser un array.' });
    }

    // Preparar objeto de actualización
    const updateData = {
      $set: {} // Usamos operador $set para actualización parcial
    };
    
    // Solo agregamos campos al $set si están definidos en el request
    if (id_Veterinario !== undefined) updateData.$set.id_Veterinario = id_Veterinario;
    if (id_Ganado !== undefined) updateData.$set.id_Ganado = id_Ganado;
    if (Temperatura !== undefined) updateData.$set.Temperatura = Temperatura;
    if (Frecuencia_Cardiaca !== undefined) updateData.$set.Frecuencia_Cardiaca = Frecuencia_Cardiaca;
    if (Nivel_Deshidratacion !== undefined) updateData.$set.Nivel_Deshidratacion = Nivel_Deshidratacion;
    
    // Arrays se actualizan solo si se envían explícitamente
    if (Desglose !== undefined) updateData.$set.Desglose = Desglose;
    if (Historial_Enfermedades !== undefined) updateData.$set.Historial_Enfermedades = Historial_Enfermedades;
    
    const updatedMonitoring = await Monitoring.findByIdAndUpdate(
      id,
      updateData, // Enviamos el objeto con $set
      { 
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedMonitoring
    });

  } catch (error) {
    console.error('Error en updateMonitoring:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};