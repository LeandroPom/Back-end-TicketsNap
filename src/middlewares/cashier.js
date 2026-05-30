// middlewares/cashier.js
const cashierAdmin = (req, res, next) => {
  if (!req.user?.cashier && !req.user?.isAdmin) {
    return res.status(403).json({ message: 'derechos de Cajero o Administrador requeridos' }); // 403 = Forbidden
  }
  next();
};

module.exports = cashierAdmin;