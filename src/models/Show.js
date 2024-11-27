// models/Show.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // Define el modelo Show
    sequelize.define('Show', {
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
            // Indica si el show está activo o inactivo
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
            // Nombre del show, obligatorio
        },
        artists: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
            // Lista de artistas que participan en el show, opcional
        },
        genre: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
            // Arreglo de géneros relacionados con el show, opcional
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
            // Descripción del show, opcional
        },
        coverImage: {
            type: DataTypes.STRING,
            allowNull: true
            // Imagen de portada del show, opcional
        },
        location: {
            type: DataTypes.JSON,
            allowNull: false
            // Información de la ubicación como un objeto JSON con "name" y "address"
        },
        presentation: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
            validate: {
                isArrayOfObjects(value) {
                    if (!Array.isArray(value) || !value.every(item => item.date && item.performance)) {
                        throw new Error('Each function must be an object with "date" and "performance" properties.');
                    }
                }
            }
            // Arreglo de objetos que contienen fecha y hora (`date`) y número de función (`performance`).
        }
    }, {
        timestamps: false,
        freezeTableName: true
        // Configuración para evitar los timestamps y asegurar que el nombre de la tabla sea igual al modelo
    });
};
