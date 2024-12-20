const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Zone = sequelize.define('Zone', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    zoneName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    generalTicket: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    presentation: {
      type: DataTypes.JSONB, // JSON con la información de fecha, hora y performance
      allowNull: false,
      validate: {
        validatePresentation(value) {
          if (
            !value.date || 
            !value.performance || 
            !value.time || 
            !value.time.start ||
            !value.time.end
          ) {
            throw new Error('Presentation must include date, performance, and start/end time.');
          }
        },
      },
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isValidLocation(value) {
          if (!Array.isArray(value)) {
            throw new Error('La propiedad "location" debe ser un array.');
          }

          value.forEach((division) => {
            if (!division.division || typeof division.division !== 'string') {
              throw new Error('Cada división debe tener una propiedad "division" de tipo string.');
            }

            if (division.rows) {
              if (!Array.isArray(division.rows)) {
                throw new Error('La propiedad "rows" debe ser un array si está presente.');
              }
              division.rows.forEach((row) => {
                if (typeof row.row !== 'number') {
                  throw new Error('Cada fila debe tener una propiedad "row" de tipo número.');
                }

                if (row.seats) {
                  if (!Array.isArray(row.seats)) {
                    throw new Error('La propiedad "seats" debe ser un array.');
                  }
                  const seatIds = new Set();
                  row.seats.forEach((seat) => {
                    if (typeof seat.id !== 'number') {
                      throw new Error('Cada asiento debe tener una propiedad "id" de tipo número.');
                    }
                    if (seatIds.has(seat.id)) {
                      throw new Error('Los ids de los asientos deben ser únicos dentro de una fila.');
                    }
                    seatIds.add(seat.id);
                    if (typeof seat.x !== 'number' || typeof seat.y !== 'number') {
                      throw new Error('Las propiedades "x" e "y" de los asientos deben ser números.');
                    }
                    if (typeof seat.taken !== 'boolean') {
                      throw new Error('La propiedad "taken" debe ser un booleano.');
                    }
                  });
                }
              });
            } else {
              if (typeof division.space !== 'number' || division.space <= 0) {
                throw new Error(
                  'La propiedad "space" debe ser un número positivo para divisiones sin filas.'
                );
              }
              if (typeof division.remainingPlaces !== 'number' || division.remainingPlaces < 0) {
                throw new Error(
                  'La propiedad "remainingPlaces" debe ser un número no negativo.'
                );
              }
              if (typeof division.occupied !== 'number' || division.occupied < 0) {
                throw new Error('La propiedad "occupied" debe ser un número no negativo.');
              }
            }
            if (
              typeof division['general Price'] !== 'number' ||
              division['general Price'] <= 0
            ) {
              throw new Error(
                'La propiedad "general Price" debe ser un número positivo en todas las divisiones.'
              );
            }
          });
        },
      },
    },
  });

  return Zone;
};
