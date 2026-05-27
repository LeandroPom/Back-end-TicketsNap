const { Zone } = require('../../db');

module.exports = async (zoneName, generalTicket, presentation, location, showId) => {
  try {
    if (!zoneName || typeof zoneName !== 'string') {
      throw new Error('El nombre de la zona es obligatorio y debe ser una cadena válida.');
    }

    if (typeof generalTicket !== 'boolean') {
      throw new Error('El campo "generalTicket" es obligatorio y debe ser booleano.');
    }

    if (
      !presentation ||
      !presentation.date ||
      !presentation.performance ||
      !presentation.time ||
      !presentation.time.start ||
      !presentation.time.end
    ) {
      throw new Error('El campo "presentation" y sus propiedades son obligatorios.');
    }

    if (!Array.isArray(location) || location.length === 0) {
      throw new Error('El campo "location" es obligatorio y debe ser un arreglo no vacío.');
    }

    location.forEach((division) => {
      if (!division.division || typeof division.generalPrice !== 'number' || !Array.isArray(division.rows)) {
        throw new Error(
          'Cada "division" debe tener un nombre, un "generalPrice" numérico, y filas válidas.'
        );
      }

      division.rows.forEach((row) => {
        if (row.row == null || (!generalTicket && typeof row.rowPrice !== 'number') || !Array.isArray(row.seats)) {
          throw new Error(
            'Cada "row" debe tener un número, un precio de fila si "generalTicket" es falso, y un arreglo de asientos.'
          );
        }

        row.seats.forEach((seat) => {
          if (seat.id == null || typeof seat.x !== 'number' || typeof seat.y !== 'number') {
            throw new Error('Cada "seat" debe tener un ID y coordenadas "x" y "y".');
          }
        });
      });
    });

    // No bloquear por nombre si es template reutilizable; usamos showId
    const existingZone = await Zone.findOne({ where: { zoneName, showId } });
    if (existingZone) {
      throw new Error(`Ya existe una zona con el nombre "${zoneName}" para este show.`);
    }

    // Inicializar `taken` de los asientos
    location.forEach((division) => {
      division.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          seat.taken = false;
        });
      });
    });

    // Crear la nueva zona
    const newZone = await Zone.create({
      zoneName,
      generalTicket,
      presentation,
      location,
      showId, // asociamos al show
    });

    console.log('Zona creada exitosamente:', newZone.zoneName);
    return newZone;

  } catch (error) {
    console.error('Error al crear la zona:', error.message);
    throw new Error(error.message);
  }
};
