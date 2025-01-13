// models/Place.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // Define el modelo Customer
    sequelize.define('Customer', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true 
        },
        name: {
            type: DataTypes.STRING, 
            allowNull: false 
            // Nombre obligatorio
        },
        dni: {
            type: DataTypes.INTEGER,
            allowNull: false 
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
            // Dirección de correo electrónico (debe ser único y es obligatorio)
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
            // Número de teléfono del usuario (opcional)
        }
    }, {
        timestamps: false, 
        freezeTableName: true 
    });
};
