const { Zone } = require('../../db');

module.exports = async (zoneName, generalTicket, presentation, location) => {
  try {
    // Normalizar el nombre de la zona (primera letra en mayúscula)
    const normalizedZoneName =
      zoneName.charAt(0).toUpperCase() + zoneName.slice(1).toLowerCase();

    // Validar `zoneName`
    if (!zoneName || typeof zoneName !== 'string') {
      throw new Error('El nombre de la zona es obligatorio y debe ser una cadena válida.');
    }

    // Validar `generalTicket`
    if (typeof generalTicket !== 'boolean') {
      throw new Error('El campo "generalTicket" es obligatorio y debe ser booleano.');
    }

    // Validar `presentation`
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

    // Validar `location`
    if (!Array.isArray(location) || location.length === 0) {
      throw new Error('El campo "location" es obligatorio y debe ser un arreglo no vacío.');
    }

    location.forEach((division) => {
      if (
        !division.division ||
        typeof division['general Price'] !== 'number' ||
        !Array.isArray(division.rows)
      ) {
        throw new Error(
          'Cada "division" debe tener un nombre, un "general Price" numérico, y filas válidas.'
        );
      }

      division.rows.forEach((row) => {
        if (
          !row.row ||
          (generalTicket === false && typeof row.rowPrice !== 'number') ||
          !Array.isArray(row.seats)
        ) {
          throw new Error(
            'Cada "row" debe tener un número, un precio de fila si "generalTicket" es falso, y un arreglo de asientos.'
          );
        }

        row.seats.forEach((seats) => {
          if (!seats.id || typeof seats.x !== 'number' || typeof seats.y !== 'number') {
            throw new Error('Cada "seats" debe tener un ID, coordenadas "x" y "y".');
          }
        });
      });
    });

    // Verificar duplicados en `zoneName`
    const existingZone = await Zone.findOne({ where: { zoneName: normalizedZoneName } });
    if (existingZone) {
      throw new Error(`La zona con el nombre "${normalizedZoneName}" ya existe.`);
    }

    // Agregar propiedad `taken` a cada asiento
    location.forEach((division) => {
      division.rows.forEach((row) => {
        row.seats.forEach((seats) => {
          seats.taken = false; // Todos los asientos empiezan como no reservados
        });
      });
    });

    // Crear la nueva zona
    const newZone = await Zone.create({
      zoneName: normalizedZoneName,
      generalTicket,
      presentation,
      location,
    });

    console.log('Zona creada exitosamente:', newZone.zoneName);
    return newZone;
  } catch (error) {
    console.error('Error al crear la zona:', error.message);
    throw new Error(error.message);
  }
};
