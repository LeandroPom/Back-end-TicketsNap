// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definir el modelo User
  sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
      // ID único autoincremental que identifica a cada usuario
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
      // Nombre del usuario (opcional)
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
      // Dirección de correo electrónico (debe ser único y es obligatorio)
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [6, 100], // La contraseña debe tener entre 6 y 100 caracteres
          msg: "La contraseña debe tener al menos 6 caracteres"
        },
        is: {
          args: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, // Requiere al menos una letra y un número
          msg: "La contraseña debe contener al menos una letra y un número"
        }
      }
      // Contraseña del usuario (obligatoria, con validaciones de seguridad)
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
      // Fecha de registro del usuario, se genera automáticamente al momento de crearlo
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
      // Número de teléfono del usuario (opcional)
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
      // Indica si el usuario tiene permisos de administrador (por defecto, no)
    },
    google: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
      // Indica si el usuario se registró utilizando Google
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
      // URL de la imagen de perfil del usuario (opcional)
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
      // Estado del usuario (activo por defecto)
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
      // Indica si el usuario ha confirmado su cuenta (por defecto, no)
    },
    role: {
      type: DataTypes.ENUM('editor', 'user'),
      allowNull: false,
      defaultValue: 'user'
      // Rol del usuario, puede ser 'editor' o 'user' (por defecto, 'user')
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
      // Indica si la cuenta del usuario está desactivada (por defecto, no)
    }
  }, {
    timestamps: false, // No se crean automáticamente los campos `createdAt` y `updatedAt`
    freezeTableName: true // El nombre de la tabla será igual al modelo definido (User)
  });
};
