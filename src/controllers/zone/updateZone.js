// controllers/zone/updateZone.js
const { Zone } = require('../../db');

module.exports = async (zoneId, division, row, seatId) => {
  try {
    // Obtener la zona
    const zone = await Zone.findByPk(zoneId);
    if (!zone) {
      throw new Error(`La zona con ID "${zoneId}" no existe.`);
    }

    // Marcar el asiento como ocupado
    const updatedLocation = zone.location.map(div => {
      if (div.division === division) {
        div.rows = div.rows.map(r => {
          if (r.row === row) {
            r.seats = r.seats.map(seat => {
              if (seat.id === seatId) {
                return { ...seat, taken: true };  // Marcamos el asiento como ocupado
              }
              return seat;
            });
          }
          return r;
        });
      }
      return div;
    });

    // Actualizar la zona en la base de datos
    await Zone.update(
      { location: updatedLocation },
      { where: { id: zoneId } }
    );
  } catch (error) {
    throw new Error(`Error al actualizar la zona: ${error.message}`);
  }
};
