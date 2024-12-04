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
        unique: true,
        set(value) {
          // Asegurar la primera letra en mayúscula
          this.setDataValue('zoneName', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
        },
      },
      seats: {
        type: DataTypes.JSONB, // Estructura que permite almacenar un array de objetos
        allowNull: false,
        defaultValue: [],
        validate: {
          validateSeats(value) {
            if (!Array.isArray(value)) {
              throw new Error('Seats must be an array.');
            }
            value.forEach((seat) => {
              if (
                !seat.id ||
                typeof seat.id !== 'string' ||
                typeof seat.x !== 'number' ||
                typeof seat.y !== 'number' ||
                typeof seat.price !== 'number' ||
                typeof seat.reserved !== 'boolean'
              ) {
                throw new Error('Each seat must have id, x, y, price, and reserved fields.');
              }
              if (seat.price < 1) {
                throw new Error('Seat price must be at least 1.');
              }
            });
          },
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
