const express = require("express");
const router = require("./routes"); // Asegúrate de que las rutas están correctamente importadas
const morgan = require("morgan");
const cors = require("cors"); // Importar CORS

const server = express();

// Configura los permisos CORS (ajusta según sea necesario)
const corsOptions = {
  origin: '*', // Permitir solo este dominio
  credentials: true, // Permitir el envío de cookies
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'], // Encabezados permitidos
};

// Aplica CORS globalmente antes de las rutas
server.use(cors(corsOptions));

// Usa morgan para registrar las solicitudes HTTP
server.use(morgan("dev"));

// Middleware para procesar JSON
server.use(express.json());

// Usa las rutas definidas en el enrutador
server.use(router);

module.exports = server;


