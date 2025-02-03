const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Se eliminaron las validaciones, ahora están en createUser.js
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cashier: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    google: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    failedAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
    
  }, {
    timestamps: false,
    freezeTableName: true
  });
};
