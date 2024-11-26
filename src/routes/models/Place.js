// models/Location.js
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
            allowNull: true 
            // Dirección de la ubicación, opcional
        },
        capacity: {
            type: DataTypes.INTEGER, 
            allowNull: false 
            // Capacidad máxima del establecimiento, obligatorio
        },
        layout: {
            type: DataTypes.ENUM('theater', 'arena', 'field', 'mixed'), 
            allowNull: false 
            // Disposición del establecimiento, obligatorio
        }
    }, {
        timestamps: false, 
        freezeTableName: true 
    });
};
