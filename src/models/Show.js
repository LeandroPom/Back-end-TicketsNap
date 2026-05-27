//
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
sequelize.define('Show', {
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
    },
    artists: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    genre: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.JSON,
        allowNull: true
    },
    presentation: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
        validate: { /* tu validación */ }
    },
    isGeneral: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    serviceCharge: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: false,
        defaultValue: 1.0,
        validate: {
            min: 0,
            max: 100
        }
    },
    template: {  // ✅ Ahora sí dentro de la definición de columnas
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

  
};