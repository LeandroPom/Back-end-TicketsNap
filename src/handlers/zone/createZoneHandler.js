const createZone = require('../../controllers/zone/createZone');

module.exports = async (req, res) => {
  const { zoneName, seats } = req.body;

  if (!zoneName || !seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      error: 'Faltan datos: asegúrate de incluir "zoneName" y un array de "seats".',
    });
  }

  try {
    // Llamada al controlador para crear la zona
    const newZone = await createZone(zoneName, seats);

    res.status(201).json({
      message: 'Zona creada exitosamente',
      zone: newZone,
    });

  } catch (error) {
    
    res.status(500).json({
      error: 'Error al crear la zona',
      details: error.message,
    });
  }
};

