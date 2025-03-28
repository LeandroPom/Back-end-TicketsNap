const createUser = require('../../controllers/user/createUser');

module.exports = async (req, res) => {
  const { name, email, phone, password, image, cashier, admin, google } = req.body;
//   const createdBy = req.user?.id || "System"; // Obtener quién crea al usuario, por ejemplo, desde un token

  try {
    const newUser = await createUser(name, email, phone, password, image, cashier, admin, google);
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
