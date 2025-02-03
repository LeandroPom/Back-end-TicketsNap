const express = require("express");
const router = require("./routes"); // Asegúrate de que las rutas están correctamente importadas
const morgan = require("morgan");
const cors = require("cors"); // Importar CORS
require("dotenv").config();

const server = express();

// Configura los permisos CORS (ajusta según sea necesario)
const corsOptions = {
  origin: '*', // Puedes cambiarlo a un dominio específico si es necesario
  credentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Content-Type', 'X-Content-Type-Options'] // Para ciertos navegadores
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


