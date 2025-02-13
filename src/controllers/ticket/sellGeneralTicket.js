require("dotenv").config();
const QRCode = require('qrcode');
const { Ticket, Show, GeneralZone } = require('../../db');
const sendTicketEmail = require('../mailer/sendTicketEmail');

module.exports = async (showId, zoneId, division, price, name, dni, mail, phone, userId) => {
  try {
    // **Paso 1: Validar Show**
    const show = await Show.findByPk(showId);
    if (!show) throw new Error(`El show con ID "${showId}" no existe.`);

    // **Paso 2: Validar GeneralZone**
    const generalZone = await GeneralZone.findByPk(zoneId);
    if (!generalZone) throw new Error(`La zona general con ID "${zoneId}" no existe.`);

    // **Paso 3: Buscar la división específica dentro de GeneralZone**
    const divisionData = generalZone.location.find(div => div.division === division);
    if (!divisionData) {
      throw new Error(`La división "${division}" no existe en la zona general.`);
    }

    // **Paso 4: Validar espacio disponible**
    if (divisionData.occupied >= divisionData.space) {
      throw new Error(`Todos los espacios en "${division}" han sido vendidos.`);
    }

    // **Paso 5: Validar el precio**
    const validPrice = Number(divisionData.price);
    if (Number(price) !== validPrice) {
      throw new Error(`El precio ingresado (${price}) no coincide con el precio registrado (${validPrice}).`);
    }

    // **Paso 6: Incrementar ocupación en la división**
    const updatedLocation = generalZone.location.map(div => {
      if (div.division === division) {
        return { ...div, occupied: div.occupied + 1 };
      }
      return div;
    });

    await GeneralZone.update(
      { location: updatedLocation },
      { where: { id: zoneId } }
    );

    // **Paso 7: Crear el Ticket**
    const newTicket = await Ticket.create({
      userId,
      zoneId: zoneId,
      showId,
      division,
      state: true,
      location: `${show.location}`,
      date: `${new Date(generalZone.presentation.date).toISOString().split('T')[0]} || ${generalZone.presentation.time.start} - ${generalZone.presentation.time.end}`,
      function: generalZone.presentation.performance,
      row: null,
      seat: null,
      price,
      name,
      dni,
      mail,
      phone,
    });

    // **Paso 8: Generar código QR**
    const qrUrl = `${process.env.BACKEND_URL}/tickets/useQR/${newTicket.id}`;
    const qrCode = await QRCode.toDataURL(qrUrl);

    // **Paso 9: Guardar QR en el ticket**
    await Ticket.update({ qrCode: qrCode }, { where: { id: newTicket.id } });

    console.log(`🎟️ QR generado para el Ticket con ID ${newTicket.id}.`);

    let formattedTicket = {
      userId,
      zoneId: zoneId,
      showId,
      division,
      state: true,
      location: `${show.location}`,
      date: `${new Date(generalZone.presentation.date).toISOString().split('T')[0]} || ${generalZone.presentation.time.start} - ${generalZone.presentation.time.end}`,
      function: generalZone.presentation.performance,
      row: null,
      seat: null,
      price,
      name,
      dni,
      mail,
      phone,
      qrCode: qrCode,
      showName: `${show.name}`
    };

    // **Paso 10: Enviar el ticket por correo**
    await sendTicketEmail(formattedTicket);

    return formattedTicket;
  } catch (error) {
    console.error(`Error en sellGeneralTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};