// Importar el modelo Zone desde la base de datos
const { Zone } = require('../../db');

module.exports = async (identifier, updates) => {
  try {
    // **Paso 1: Verificar si se recibió el identificador (id o zoneName)**
    if (!identifier || (!identifier.id && !identifier.zoneName)) {
      throw new Error('Debes proporcionar un "id" o "zoneName" para localizar la zona.');
    }

    // **Paso 2: Buscar la zona utilizando el id o el zoneName**
    const zone = await Zone.findOne({
      where: {
        ...(identifier.id && { id: identifier.id }),
        ...(identifier.zoneName && { zoneName: identifier.zoneName }),
      },
    });

    if (!zone) {
      throw new Error(`No se encontró ninguna zona con el identificador proporcionado.`);
    }

    // **Paso 3: Validar y actualizar los campos recibidos**
    const updatedFields = {};

    // **Actualizar el zoneName si se proporciona**
    if (updates.zoneName) {
      updatedFields.zoneName = updates.zoneName.charAt(0).toUpperCase() + updates.zoneName.slice(1).toLowerCase();
    }

    // **Actualizar los seats si se proporcionan**
    if (updates.seats) {
      // Mapa de los asientos actuales para facilitar la comparación
      const currentSeats = zone.seats.reduce((map, seat) => {
        map[seat.id] = seat;
        return map;
      }, {});

      // Iterar sobre los asientos enviados en updates
      const updatedSeats = updates.seats.map((seat) => {
        if (currentSeats[seat.id]) {
          // Si el asiento existe, combinar propiedades existentes y nuevas
          return { ...currentSeats[seat.id], ...seat };
        } else {
          // Si el asiento es nuevo, agregarlo
          return seat;
        }
      });

      // Validar que no haya IDs duplicados
      const seatIds = updatedSeats.map((seat) => seat.id);
      if (new Set(seatIds).size !== seatIds.length) {
        throw new Error('No se permiten asientos con IDs duplicados.');
      }

      updatedFields.seats = updatedSeats;
    }

    // **Paso 4: Aplicar actualizaciones a la zona y guardar en la base de datos**
    await zone.update(updatedFields);

    // **Paso 5: Retornar la zona actualizada**
    console.log(`Zona actualizada exitosamente: ${zone.zoneName}`);
    return zone;

  } catch (error) {
    // **Manejo de errores**
    console.error('Error al actualizar la zona:', error.message);
    throw new Error(error.message);
  }
};
