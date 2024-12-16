// models/Place.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // Define el modelo Place
    sequelize.define('Place', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true 
        },
        state: {
            type: DataTypes.BOOLEAN, 
            defaultValue: true 
        },
        name: {
            type: DataTypes.STRING, 
            allowNull: false 
            // Nombre de la ubicación, obligatorio
        },
        address: {
            type: DataTypes.STRING, 
            allowNull: false 
            // Dirección de la ubicación, opcional
        }
    }, {
        timestamps: false, 
        freezeTableName: true 
    });
};
