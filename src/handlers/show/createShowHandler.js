// handlers/show/createShowHandler.js
const createShow = require('../../controllers/show/createShow');
const addZone = require('../../controllers/zone/addZone');

module.exports = async (req, res) => {
  const {
    name,
    artists,
    genre,
    locationName,
    presentation,
    description,
    coverImage,
    isGeneral,
    templateName,
    locationZones,
    serviceCharge // <-- información de las divisiones/zonas que quieras enviar
  } = req.body;

  try {
    // 1️⃣ Crear el show
    const newShow = await createShow(
      name,
      artists,
      genre,
      locationName,
      presentation,
      description,
      coverImage,
      isGeneral,
      templateName || null,
      serviceCharge
    );

    console.log('Show created successfully:', newShow);

    // 2️⃣ Crear la zona basada en el template (solo si se envió templateName)
    let newZone = null;
    if (templateName) {
      newZone = await addZone({
        showId: newShow.id,
        templateName,
        updates: {
          presentation,      // fecha, performance, tiempo
          generalTicket: isGeneral || false,
          location: locationZones || [], // divisiones, filas, precios
        },
      });

      console.log('Zone created successfully:', newZone.zoneName);
    }

    // 3️⃣ Devolver respuesta completa al frontend
    res.status(201).json({
      show: newShow,
      zone: newZone,
    });

  } catch (error) {
    console.error('Error creating show:', error.message);
    const statusCode = error.code || 500;
    res.status(statusCode).json({ message: error.message });
  }
};