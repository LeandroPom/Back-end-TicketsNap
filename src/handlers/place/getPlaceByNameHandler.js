const getPlaceByName = require('../../controllers/place/getPlaceByName');

module.exports = async (req, res) => {
  const { name } = req.body; // Obtener el parámetro "name" desde la query
  console.log(name)

  try {
    // Llamar al controlador con el nombre proporcionado
    const places = await getPlaceByName(name);

    // Responder con los resultados
    return res.status(200).json(places);
  } catch (error) {
    // Manejar errores y responder con el código adecuado
    const statusCode = error.code || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
