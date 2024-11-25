require("dotenv").config(); 
const fs = require('fs');
const path = require('path');
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, NODE_ENV } = process.env;
const { Sequelize } = require("sequelize");

// Configuración para desarrollo y producción
const sequelize = NODE_ENV === "production"
  ? new Sequelize({
      database: DB_NAME,
      username: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
      native: false,
    })
  : new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
      logging: false,
      native: false,
    });
// Configura la conexión a la base de datos con Sequelize. Si el entorno es "producción", se configuran opciones adicionales para la conexión segura (SSL). En desarrollo, la conexión es más simple.

const basename = path.basename(__filename);
// Obtiene el nombre del archivo actual para evitar incluirlo luego al cargar modelos

const modelDefiners = [];
// Arreglo donde se almacenarán las definiciones de modelos (archivos .js)

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });
// Lee todos los archivos en la carpeta 'models' y carga aquellos que no empiezan con un punto (.) y que sean archivos .js. Luego, los añade al arreglo modelDefiners.

modelDefiners.forEach(model => model(sequelize));
// Itera sobre todos los modelos cargados y los define en la instancia de sequelize

const {  } = sequelize.models;
// Extrae los modelos definidos dentro de Sequelize

// Relacionar los modelos en la base de datos


module.exports = {
  ...sequelize.models, // Exporta todos los modelos creados en Sequelize
  conn: sequelize,     // Exporta la conexión a la base de datos
};
