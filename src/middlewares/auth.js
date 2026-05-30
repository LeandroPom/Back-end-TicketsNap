// middlewares/auth.js
require('dotenv').config(); // 🔹 cargar variables de entorno
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Authorization header recibido:', req.headers['authorization']); // 🔍 depuración
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    console.log('No se encontró token');
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    // ⚠️ hardcodeamos el secret para prueba
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log('Decoded JWT:', decoded); // 🔍 verificación
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Error verificando token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = auth;
