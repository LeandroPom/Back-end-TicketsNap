// models/Ticket.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // Define el modelo Ticket
    sequelize.define('Ticket', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
            // Identificador único y llave primaria auto-incremental
        },
        state: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
            // Indica si el ticket está activo o inactivo
        },
        location: {
            type: DataTypes.JSON,
            allowNull: true
            // Información de la ubicación como un objeto JSON con "name" y "address"
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
            // Fecha y hora de la función asociada al ticket
        },
        function: {
            type: DataTypes.STRING,
            allowNull: false
            // Representa la función específica del día (ej: "1", "2", "3")
        },
        row: {
            type: DataTypes.STRING,
            allowNull: true
            // Fila asignada para el ticket, opcional
        },
        seat: {
            type: DataTypes.STRING,
            allowNull: true
            // Asiento asignado para el ticket, opcional
        },
        price: {
            type: DataTypes.FLOAT, 
            allowNull: false 
            // Precio del ticket, obligatorio
        },
        qrCode: {
            type: DataTypes.STRING, 
            allowNull: false 
            // Código QR almacenado como texto o base64, obligatorio
        },
        comment: {
            type: DataTypes.TEXT, 
            allowNull: true 
            // Comentario asociado al ticket, opcional
        },
        rating: {
            type: DataTypes.INTEGER, 
            allowNull: true, 
            validate: { min: 1, max: 5 }
            // Puntuación del ticket con valores entre 1 y 5, opcional
        }
    }, {
        timestamps: false,
        freezeTableName: true
        // Configuración para evitar los timestamps y asegurar que el nombre de la tabla sea igual al modelo
    });
};
