const { Zone } = require('../../db');

module.exports = async (identifier, updates) => {
  try {
    if (!identifier || (!identifier.id && !identifier.zoneName)) {
      throw new Error('Debes proporcionar un "id" o "zoneName" para localizar la zona.');
    }

    const zone = await Zone.findOne({
      where: {
        ...(identifier.id && { id: identifier.id }),
        ...(identifier.zoneName && { zoneName: identifier.zoneName }),
      },
    });

    if (!zone) {
      throw new Error(`No se encontró ninguna zona con el identificador proporcionado.`);
    }

    const updatedFields = {};

    if (updates.zoneName) {
      updatedFields.zoneName = updates.zoneName.charAt(0).toUpperCase() + updates.zoneName.slice(1).toLowerCase();
    }

    if (typeof updates.generalTicket !== 'undefined') {
      updatedFields.generalTicket = updates.generalTicket;
    }

    if (updates.presentation) {
      updatedFields.presentation = updates.presentation;
    }

    if (updates.location) {
      if (!Array.isArray(updates.location)) {
        throw new Error('El campo "location" debe ser un array válido.');
      }

      const mergedLocation = (zone.location || []).map(existingDiv => {
        const updateDiv = updates.location.find(d => d.division === existingDiv.division);
        if (!updateDiv) return existingDiv;

        // Divisiones con filas
        if (Array.isArray(existingDiv.rows) && existingDiv.rows.length > 0) {
          const mergedRows = existingDiv.rows.map(existingRow => {
            const updateRow = (updateDiv.rows || []).find(r => r.row === existingRow.row);
            if (!updateRow) return existingRow;

            const rowPrice = typeof updateRow.rowPrice === 'number' ? updateRow.rowPrice : existingRow.rowPrice;
            if (rowPrice < 0) throw new Error(`El precio de la fila ${existingRow.row} debe ser positivo`);

            return {
              ...existingRow,
              rowPrice,
            };
          });

          const generalPrice = typeof updateDiv.generalPrice === 'number' ? updateDiv.generalPrice : existingDiv.generalPrice;
          if (generalPrice < 0) throw new Error(`El precio general de la división ${existingDiv.division} debe ser positivo`);

          return {
            ...existingDiv,
            generalPrice,
            rows: mergedRows,
          };
        }

        // Divisiones sin filas
        const generalPrice = typeof updateDiv.generalPrice === 'number' ? updateDiv.generalPrice : existingDiv.generalPrice;
        const space = typeof updateDiv.space === 'number' ? updateDiv.space : existingDiv.space;
        const occupied = typeof updateDiv.occupied === 'number' ? updateDiv.occupied : existingDiv.occupied;

        if (generalPrice < 0) throw new Error(`El precio general de la división ${existingDiv.division} debe ser positivo`);
        if (space < 0) throw new Error(`El espacio de la división ${existingDiv.division} debe ser positivo`);
        if (occupied < 0) throw new Error(`La propiedad occupied de ${existingDiv.division} debe ser positiva`);

        return {
          ...existingDiv,
          generalPrice,
          space,
          occupied,
          ...(existingDiv.hasVip !== undefined && updateDiv.hasVip !== undefined ? { hasVip: updateDiv.hasVip } : {}),
        };
      });

      updatedFields.location = mergedLocation;
    }

    await zone.update(updatedFields);

    console.log(`Zona actualizada exitosamente: ${zone.zoneName}`);
    return zone;

  } catch (error) {
    console.error('Error al actualizar la zona:', error.message);
    throw new Error(error.message);
  }
};