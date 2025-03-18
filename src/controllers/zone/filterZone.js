const { Zone } = require('../../db');

module.exports = async (zoneId, division, row, seatId) => {
  
    // Validar que el ID de la Zone sea proporcionado
    if (!zoneId) {
      throw new Error('El parámetro zoneId es obligatorio.');
    }
  
    // Recuperar la Zone por ID
    const zone = await Zone.findByPk(zoneId);
    if (!zone) {
      throw new Error('Zone no encontrada.');
    }
  
    // Extraer el atributo location del JSON
    const { location } = zone;
    if (!Array.isArray(location)) {
      throw new Error('Estructura de location inválida en la Zone.');
    }
  
    // Filtrar por division si se proporciona
    let result = location;
    if (division) {
      result = result.filter((div) => div.division === division);
      if (result.length === 0) {
        throw new Error(`División '${division}' no encontrada.`);
      }
    }
  
    // Filtrar por row si se proporciona
    if (row) {
      result = result.flatMap((div) => div.rows || []).filter((r) => r.row === row);
      if (result.length === 0) {
        throw new Error(`Row '${row}' no encontrada en la división '${division || 'especificada'}'.`);
      }
    }
  
    // Filtrar por seatId si se proporciona
    if (seatId) {
      result = result.flatMap((r) => r.seats || []).filter((seat) => seat.id === seatId);
      if (result.length === 0) {
        throw new Error(`Seat con ID '${seatId}' no encontrado en la fila '${row || 'especificada'}'.`);
      }
    }
  
    return result;
};