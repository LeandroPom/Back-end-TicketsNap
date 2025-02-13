const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GeneralZone = sequelize.define('GeneralZone', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Obligatorio
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // Puede ser true o false
    },
    presentation: {
      type: DataTypes.JSONB,
      allowNull: false, // Almacena date, performance y time {start, end}
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [], // Se almacena como un array de objetos
    },
  });

  return GeneralZone;
};
