
const User = require('../models/userModel');

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Tipo_U, ...updateData } = req.body;

    // 1. Verificar si el usuario existe antes de actualizar
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({ error: `El usuario con ID ${id} no existe` });
    }

    // 2. Validar el tipo de usuario, si se envía
    const validTypes = [1, 2, 3, 4];
    if (Tipo_U && !validTypes.includes(parseInt(Tipo_U, 10))) {
      return res.status(400).json({
        error: `Tipo de usuario inválido. Valores permitidos: ${validTypes.join(', ')}`
      });
    }

    if (updateData.telefono && !/^\d{10}$/.test(updateData.telefono)) {
      return res.status(400).json({
        error: 'El teléfono debe contener exactamente 10 dígitos numéricos.'
      });
    }

    // 3. Intentar actualizar
    const [updated] = await User.update(
      { ...updateData, ...(Tipo_U && { Tipo_U }) },
      { where: { id_Usuario: id } }
    );

    // 4. Revisar si no hubo cambios
    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: 'No hubo cambios en el usuario'
      });
    }

    // 5. Usuario actualizado
    const updatedUser = await User.findByPk(id);
    return res.status(200).json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    // Manejo específico de error de email duplicado
    if (
      error.name === 'SequelizeUniqueConstraintError' &&
      error.errors &&
      error.errors.some(e => e.path && e.path.toLowerCase().includes('email'))
    ) {
      return res.status(400).json({ error: 'El email ya está registrado por otro usuario.' });
    }

    // Otros errores de validación
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }

    // Log para depuración (opcional)
    console.error('Error en updateUser:', error);

    // Error inesperado
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
