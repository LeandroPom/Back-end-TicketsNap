// middlewares/admin.js
const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin requerido' }); // 403 = Forbidden
  }
  next();
};

module.exports = adminOnly;