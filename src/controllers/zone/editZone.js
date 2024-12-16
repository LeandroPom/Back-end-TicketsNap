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

    // **Actualizar generalTicket si se proporciona**
    if (typeof updates.generalTicket !== 'undefined') {
      updatedFields.generalTicket = updates.generalTicket;
    }

    // **Actualizar presentation si se proporciona**
    if (updates.presentation) {
      updatedFields.presentation = updates.presentation;
    }

    // **Actualizar location si se proporciona**
    if (updates.location) {
      if (typeof updates.location !== 'object') {
        throw new Error('El campo "location" debe ser un objeto válido.');
      }
      updatedFields.location = updates.location;
    }

    // **Paso 4: Validar reglas dependientes**
    // if (typeof updatedFields.generalTicket !== 'undefined') {
    //   const { generalTicket, location } = { ...zone.toJSON(), ...updatedFields };
    //   if (generalTicket && !location.generalPrice) {
    //     throw new Error('Cuando "generalTicket" es true, "location.generalPrice" debe estar definido.');
    //   }
    //   if (!generalTicket && !location.rowPrice) {
    //     throw new Error('Cuando "generalTicket" es false, "location.rowPrice" debe estar definido.');
    //   }
    // }

    // **Paso 5: Aplicar actualizaciones a la zona y guardar en la base de datos**
    await zone.update(updatedFields);

    // **Paso 6: Retornar la zona actualizada**
    console.log(`Zona actualizada exitosamente: ${zone.zoneName}`);
    return zone;
  } catch (error) {
    // **Manejo de errores**
    console.error('Error al actualizar la zona:', error.message);
    throw new Error(error.message);
  }
};
