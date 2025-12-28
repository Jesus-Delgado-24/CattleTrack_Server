module.exports = (req, res, next) => {
  // Solo validar si se está enviando Tipo_U en el body
  if (req.body.Tipo_U !== undefined) {
    const validTypes = [1, 2, 3, 4];
    const tipoUsuario = parseInt(req.body.Tipo_U);
    
    if (!validTypes.includes(tipoUsuario)) {
      return res.status(400).json({
        success: false,
        error: `Tipo de usuario inválido (${req.body.Tipo_U}). Valores permitidos: 1 (Dueño), 2 (Admin), 3 (Trabajador), 4 (Veterinario)`,
        receivedType: req.body.Tipo_U,
        validTypes: validTypes
      });
    }
  }
  
  next(); // Si es válido o no se está modificando el tipo
};