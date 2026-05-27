const { Zone } = require('../../db');
const fs = require('fs');
const path = require('path');

module.exports = async ({ showId, updates, templateName }) => {
  try {
    if (!templateName) {
      throw new Error('El nombre de la plantilla es obligatorio.');
    }

    // Normalizar nombre
    const templateNameNormalized = templateName.toLowerCase();
    const filePath = path.join(
      __dirname,
      `../../Templates/${templateNameNormalized}.json`
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `El template base "${templateName}" no existe en Templates/.`
      );
    }

    // Leer template base
    const templateData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Clonar para no modificar el JSON original
    const zoneData = JSON.parse(JSON.stringify(templateData));

    // Asignar showId y marcar como no plantilla
    zoneData.showId = showId;
    zoneData.isTemplate = false;

    // ==============================
    // Actualizar presentación
    // ==============================
    if (updates.presentation) {
      zoneData.presentation = updates.presentation;
    }

    // ==============================
    // Actualizar generalTicket
    // ==============================
    if (typeof updates.generalTicket === 'boolean') {
      zoneData.generalTicket = updates.generalTicket;
    }

    // ==============================
    // Aplicar SOLO precios (merge)
    // ==============================
    if (Array.isArray(updates.location)) {

      updates.location.forEach(updateDiv => {

        const division = zoneData.location.find(
          d => d.division === updateDiv.division
        );

        if (!division) return;

        // Precio general de división
        if (typeof updateDiv.generalPrice === 'number') {
          division.generalPrice = updateDiv.generalPrice;
        }

        if (!Array.isArray(updateDiv.rows)) return;

        updateDiv.rows.forEach(updateRow => {

          const row = division.rows.find(
            r => r.row === updateRow.row
          );

          if (!row) return;

          // Precio por fila
          if (typeof updateRow.rowPrice === 'number') {
            row.rowPrice = updateRow.rowPrice;
          }

          if (!Array.isArray(updateRow.seats)) return;

          updateRow.seats.forEach(updateSeat => {

            const seat = row.seats.find(
              s => s.id === updateSeat.id
            );

            if (!seat) return;

            // 🔥 SOLO actualizamos seatPrice
            if (typeof updateSeat.seatPrice === 'number') {
              seat.seatPrice = updateSeat.seatPrice;
            }

          });

        });

      });

    }

    // ==============================
    // Guardar en DB
    // ==============================
    const newZone = await Zone.create(zoneData);

    console.log(
      `Zona basada en plantilla "${templateName}" guardada para showId ${showId}`
    );

    return newZone;

  } catch (error) {
    console.error('Error en addZone:', error);
    throw error;
  }
};
