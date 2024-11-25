const express = require("express");
const router = require("./routes");
const morgan = require("morgan");

const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.use(router);

module.exports = server;
