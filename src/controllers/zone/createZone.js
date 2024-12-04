const { Zone } = require('../../db');

module.exports = async (zoneName, seats) => {
  try {
    // Crear la zona y asociar los asientos
    const newZone = await Zone.create(
      {
        zoneName,
        seats,
      },
      {
        include: [{ association: Zone.associations.seats }],
      }
    );

    console.log('Zona creada exitosamente:', newZone.zoneName);
    return newZone;
  } catch (error) {
    console.error('Error al crear la zona:', error.message);
    throw new Error(error.message);
  }
};

