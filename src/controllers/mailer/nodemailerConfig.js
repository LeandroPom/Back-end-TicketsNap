require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // Email oficial de la página
    pass: process.env.MAIL_PASS, // Contraseña o App Password si se usa Gmail
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ Ignora la verificación del certificado
  },
  pool: true, // Agrega un pool de conexiones
});

module.exports = transporter;
