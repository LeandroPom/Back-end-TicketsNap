const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Zone',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      zoneName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true, // No puede haber duplicados en zoneName
        set(value) {
          // Asegurar la primera letra en mayúscula
          this.setDataValue('zoneName', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
        },
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
        type: DataTypes.JSONB, // JSON con las divisiones, filas y asientos
        allowNull: false,
        validate: {
          validateLocation(value) {
            if (!Array.isArray(value)) {
              throw new Error('Location must be an array.');
            }
            value.forEach((division) => {
              if (
                !division.division ||
                (division.generalPrice == null && division.rows == null) ||
                !Array.isArray(division.rows)
              ) {
                throw new Error('Each division must include a name, rows array, and generalPrice/rowPrice.');
              }
              division.rows.forEach((row) => {
                if (
                  !row.row || 
                  (row.rowPrice == null && division.generalPrice == null) ||
                  !Array.isArray(row.seats)
                ) {
                  throw new Error('Each row must include a row number, rowPrice/generalPrice, and a seats array.');
                }
                row.seats.forEach((seats) => {
                  if (!seats.id || typeof seats.x !== 'number' || typeof seats.y !== 'number') {
                    throw new Error('Each seats must have id, x, and y coordinates.');
                  }
                });
              });
            });
          },
        },
      },
      seats: {
        type: DataTypes.JSONB, // Contiene todos los asientos de la zona
        allowNull: false,
        defaultValue: [],
        validate: {
          validateSeatss(value) {
            if (!Array.isArray(value)) {
              throw new Error('Seats must be an array.');
            }
            value.forEach((seats) => {
              if (!seats.id || typeof seats.x !== 'number' || typeof seats.y !== 'number' || typeof seats.taken !== 'boolean') {
                throw new Error('Each seats must have id, x, y, and taken fields.');
              }
            });
          },
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      // hooks: {
      //   beforeValidate(zone) {
      //     // Validación para generalTicket, generalPrice y rowPrice
      //     zone.location.forEach((division) => {
      //       if (zone.generalTicket) {
      //         if (division.generalPrice == null) {
      //           throw new Error('If generalTicket is true, generalPrice must be defined for each division.');
      //         }
      //       } else {
      //         division.rows.forEach((row) => {
      //           if (row.rowPrice == null) {
      //             throw new Error('If generalTicket is false, rowPrice must be defined for each row.');
      //           }
      //         });
      //       }
      //     });
      //   },
      // },
    }
  );
};
