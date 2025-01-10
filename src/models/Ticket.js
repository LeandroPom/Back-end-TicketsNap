const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define el modelo Ticket
  sequelize.define(
    'Ticket',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        // Identificador único y llave primaria auto-incremental
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      zoneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      showId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Show asociado al ticket (notar corrección del nombre a "showId" por consistencia)
      },
      division: {
        type: DataTypes.STRING,
        allowNull: false,
        // División de la zona (e.g., "General", "VIP")
      },
      state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        // Indica si el ticket está activo o inactivo
      },
      location: {
        type: DataTypes.JSON,
        allowNull: true,
        // Información de la ubicación como un objeto JSON con "name" y "address"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        // Fecha y hora de la función asociada al ticket
      },
      function: {
        type: DataTypes.STRING,
        allowNull: false,
        // Representa la función específica del día (ej: "1", "2", "3")
      },
      row: {
        type: DataTypes.STRING,
        allowNull: false,
        // Fila asignada para el ticket, opcional
      },
      seat: {
        type: DataTypes.STRING,
        allowNull: false,
        // Asiento asignado para el ticket, opcional
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        // Precio del ticket, obligatorio
      },
      qrCode: {
        type: DataTypes.STRING,
        allowNull: true,
        // Código QR almacenado como texto o base64; marcado opcional hasta implementación
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      // Configuración para evitar los timestamps y asegurar que el nombre de la tabla sea igual al modelo
    }
  );
};
