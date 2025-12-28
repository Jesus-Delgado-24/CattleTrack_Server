/**
 * Middleware para permitir solo ciertos tipos de usuario.
 * @param {number[]} allowedTypes - Array de tipos de usuario permitidos.
 */
module.exports = function authorizeByRole(allowedTypes = []) {
    return (req, res, next) => {
      if (!req.user || !allowedTypes.includes(req.user.Tipo_U)) {
        return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
      }
      next();
    };
  };