// const addZone = require('../../controllers/zone/addZone');

// module.exports = async (req, res) => {
//   try {
//     const { showId, templateId, zoneName, updates } = req.body;

//     console.log("🚀 Datos recibidos en addZoneHandler:", req.body);

//     if (!showId) return res.status(400).json({ error: 'Debes proporcionar un "showId".' });
//     if (!updates || typeof updates !== 'object') return res.status(400).json({ error: 'Debes proporcionar un objeto "updates".' });
//     if (!zoneName) return res.status(400).json({ error: 'Debes proporcionar un "zoneName" o "templateName".' });

//     // Llamar al controlador con showId + templateName
//     const result = await addZone({
//       showId,
//       updates,
//       templateName: zoneName  // <-- usamos el nombre del template para crear si no existe
//     });

//     console.log("✅ Zona creada/actualizada:", result);

//     return res.status(201).json({
//       message: 'Zona creada o actualizada exitosamente.',
//       newZone: result,
//     });
//   } catch (error) {
//     console.error('❌ Error en el handler addZone:', error);
//     return res.status(500).json({
//       error: 'Error interno del servidor',
//       details: error.message,
//     });
//   }
// };
const addZone = require('../../controllers/zone/addZone');

module.exports = async (req, res) => {
  try {
    const { zoneId, showId, templateId, zoneName, updates } = req.body;

    console.log("🚀 Datos recibidos en addZoneHandler:", req.body);

    if (!showId) return res.status(400).json({ error: 'Debes proporcionar un "showId".' });
    if (!updates || typeof updates !== 'object') return res.status(400).json({ error: 'Debes proporcionar un objeto "updates".' });
    if (!zoneName) return res.status(400).json({ error: 'Debes proporcionar un "zoneName".' });

    let result;

    if (zoneId) {
      // ⚡ Si tenemos zoneId, buscamos la zona existente y actualizamos
      const existingZone = await Zone.findByPk(zoneId); // Sequelize, o el equivalente en tu ORM
      if (!existingZone) {
        return res.status(404).json({ error: 'Zona no encontrada' });
      }

      result = await existingZone.update(updates);
      console.log("✅ Zona existente actualizada:", result);
    } else {
      // ⚡ Si no tenemos zoneId, usamos addZone para crear una nueva
      result = await addZone({
        showId,
        updates,
        templateName: zoneName // usar el nombre del template para crear
      });
      console.log("✅ Nueva zona creada:", result);
    }

    return res.status(200).json({
      message: 'Zona creada o actualizada exitosamente.',
      zone: result,
    });
  } catch (error) {
    console.error('❌ Error en el handler addZone:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
};
