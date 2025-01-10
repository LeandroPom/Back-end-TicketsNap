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
// Configura la conexión a la base de datos con Sequelize.

const basename = path.basename(__filename);
// Obtiene el nombre del archivo actual para evitar incluirlo luego al cargar modelos.

const modelDefiners = [];
// Arreglo donde se almacenarán las definiciones de modelos.

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });
// Lee todos los archivos en la carpeta 'models' y los añade al arreglo modelDefiners.

modelDefiners.forEach(model => model(sequelize));
// Itera sobre todos los modelos cargados y los define en la instancia de sequelize.

const { User, Ticket, Show, Place, Zone } = sequelize.models;
// Extrae los modelos definidos dentro de Sequelize.

// **Relaciones entre modelos**
// Un User puede tener muchos Tickets.
User.belongsToMany(Ticket, {through:'user_tickets' });
Ticket.hasOne(User, {through:'user_tickets' });

// Un Ticket pertenece a un único Show.
Ticket.hasOne(Show, {through:'show_tickets' });
Show.belongsToMany(Ticket, {through:'show_tickets' });

// Muchos Shows pertenecen a muchos Place.
Show.belongsToMany(Place, {through:'show_place' });
Place.belongsToMany(Show, {through:'show_place' });

module.exports = {
  ...sequelize.models, // Exporta todos los modelos creados en Sequelize.
  conn: sequelize,  // Exporta la conexión a la base de datos.
  sequelize     
};
