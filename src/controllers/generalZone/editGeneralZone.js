const { GeneralZone } = require('../../db');

module.exports = async (identifier, updates) => {
  try {
    // **Paso 1: Verificar si se recibió el identificador (id o showId)**
    if (!identifier || (!identifier.id && !identifier.showId)) {
      throw new Error('Debes proporcionar un "id" o "showId" para localizar la zona.');
    }

    // **Paso 2: Buscar la zona utilizando el id o el showId**
    const generalZone = await GeneralZone.findOne({
      where: {
        ...(identifier.id && { id: identifier.id }),
        ...(identifier.showId && { showId: identifier.showId }),
      },
    });

    if (!generalZone) {
      throw new Error(`No se encontró ninguna zona con el identificador proporcionado.`);
    }

    // **Paso 3: Validar y actualizar los campos recibidos**
    const updatedFields = {};

    // **Actualizar `presentation` si se proporciona**
    if (updates.presentation) {
      updatedFields.presentation = updates.presentation;
    }

    // **Actualizar `location` si se proporciona**
    if (updates.location) {
      updatedFields.location = updates.location.map((div) => ({
        division: div.division,
        price: div.price,
        space: div.space,
        occupied: div.occupied || 0,
        ...(div.division === "Vip" && div.hasVip !== undefined ? { hasVip: div.hasVip } : {}),
      }));
    }

    // **Paso 4: Aplicar actualizaciones y guardar en la base de datos**
    await generalZone.update(updatedFields);

    // **Paso 5: Retornar la zona actualizada**
    console.log(`GeneralZone actualizada exitosamente con showId: ${generalZone.showId}`);
    return generalZone;
    
  } catch (error) {
    // **Manejo de errores**
    console.error('Error al actualizar la zona general:', error.message);
    throw new Error(error.message);
  }
};
