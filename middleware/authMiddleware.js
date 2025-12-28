
const jwt = require('jsonwebtoken');

// Cambia esto por tu clave secreta real
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Aquí asumimos que el payload del token tiene los datos del usuario, incluyendo Tipo_U
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authenticate;
