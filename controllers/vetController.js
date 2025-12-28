
const Veterinario = require('../models/veterinarioModel');
const Usuario = require('../models/userModel');
const Sector = require('../models/sectorModel');
const { sequelize } = require('../models/db');

exports.updateVet = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { id_Usuario, id_Sector, Especialidad } = req.body;

    // Validaciones básicas
    if (!id_Usuario || !id_Sector || !Especialidad) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Verificar que el veterinario exista antes de actualizar
    const existingVet = await Veterinario.findByPk(id, { transaction });
    if (!existingVet) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'El veterinario con ese ID no existe'
      });
    }

    // Verificar que el usuario sea veterinario (Tipo_U = 4)
    const usuario = await Usuario.findByPk(id_Usuario, { transaction });
    console.log('Usuario encontrado:', usuario ? usuario.toJSON() : null);

    if (!usuario || usuario.Tipo_U !== 4) {
      throw new Error('El usuario no está registrado como veterinario');
    }

    // Verificar que el sector exista
    const sector = await Sector.findByPk(id_Sector, { transaction });
    if (!sector) {
      throw new Error('El sector no existe');
    }

    // Actualizar veterinario
    const [updatedRows] = await Veterinario.update(
      { id_Usuario, id_Sector, Especialidad },
      {
        where: { id_Veterinario: id },
        transaction
      }
    );

    // Si updatedRows === 0, significa que no hubo cambios en la BD
    if (updatedRows === 0) {
      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: 'No hubo cambios en el veterinario'
      });
    }

    // Si hubo cambios reales, confirmamos la transacción
    await transaction.commit();

    // Obtener datos actualizados
    const updatedVet = await Veterinario.findByPk(id);
    return res.status(200).json({
      success: true,
      data: updatedVet
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en updateVet:', error.message);
    return res.status(400).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
