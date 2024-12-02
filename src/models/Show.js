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
        price: {
            type: DataTypes.FLOAT,
            allowNull: false // Precio del ticket obligatorio
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
            allowNull: false
        },
        presentation: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
            validate: {
                isArrayOfObjects(value) {
                    if (!Array.isArray(value)) {
                        throw new Error('Presentation must be an array.');
                    }
                    value.forEach((item) => {
                        if (
                            typeof item.date !== 'string' || 
                            !item.performance || 
                            !item.time || 
                            typeof item.time.start !== 'string' || 
                            typeof item.time.end !== 'string'
                        ) {
                            throw new Error('Each presentation must have "date", "performance", and "time" with "start" and "end" in HH:mm format.');
                        }
                    });
                }
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
