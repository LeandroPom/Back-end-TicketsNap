const { Zone } = require('../../db');

module.exports = async (zoneName, seats) => {
  try {
    // Normalizar el nombre de la zona (primera letra en mayúscula)
    const normalizedZoneName = zoneName.charAt(0).toUpperCase() + zoneName.slice(1).toLowerCase();

    // Comprobar si ya existe una zona con el mismo nombre
    const existingZone = await Zone.findOne({ where: { zoneName: normalizedZoneName } });
    if (existingZone) {
      throw new Error(`La zona con el nombre "${normalizedZoneName}" ya existe.`);
    }

    // Establecer `reserved` en `true` para todos los asientos y validar duplicados en DB
    const existingZones = await Zone.findAll(); // Obtener todas las zonas existentes
    const existingSeatIds = existingZones
      .map((zone) => zone.seats.map((seat) => seat.id))
      .flat();

    seats.forEach((seat) => {
      seat.reserved = true; // Establecer `reserved` en true
      if (existingSeatIds.includes(seat.id)) {
        throw new Error(`El asiento con id "${seat.id}" ya existe en la base de datos.`);
      }
    });

    // Crear la nueva zona con los asientos actualizados
    const newZone = await Zone.create({
      zoneName: normalizedZoneName,
      seats,
    });

    console.log('Zona creada exitosamente:', newZone.zoneName);
    return newZone;
  } catch (error) {
    console.error('Error al crear la zona:', error.message);
    throw new Error(error.message);
  }
};
