const { Ticket, Show, GeneralZone } = require('../../db');
const payment = require('../mercadoPago/payment');

module.exports = async (showId, zoneId, division, price, name, dni, mail, phone, userId) => {
  try {
    // **Paso 1: Validar Show**
    const show = await Show.findByPk(showId);
    if (!show) throw new Error(`El show con ID "${showId}" no existe.`);

    // **Paso 2: Validar GeneralZone**
    const generalZone = await GeneralZone.findByPk(zoneId);
    if (!generalZone) throw new Error(`La zona con ID "${zoneId}" no existe.`);

    // **Paso 3: Buscar la división en location**
    const divisionData = generalZone.location.find(div => div.division === division);
    if (!divisionData) {
      throw new Error(`La división "${division}" no existe en la zona.`);
    }

    // **Paso 4: Validar espacio disponible**
    if (divisionData.occupied >= divisionData.space) {
      throw new Error(`Todos los espacios en "${division}" han sido vendidos.`);
    }

    // **Paso 5: Validar el precio correcto**
    const validPrice = Number(divisionData.price);
    if (Number(price) !== validPrice) {
      throw new Error(`El precio ingresado (${price}) no coincide con el precio registrado (${validPrice}).`);
    }

    // **Paso 6: Actualizar ocupación en location**
     //generalZone.location = generalZone.location.map(div =>
       //div.division === division ? { ...div, occupied: div.occupied + 1 } : div
     //);
     //await generalZone.save();

    // **Paso 7: Crear el Ticket**
    const newTicket = await Ticket.create({
      userId,
      zoneId,
      showId,
      division,
      state: false,
      location: `${show.location}`,
      date: `${new Date(generalZone.presentation.date).toISOString().split('T')[0]} || ${generalZone.presentation.time.start} - ${generalZone.presentation.time.end}`,
      function: generalZone.presentation.performance,
      row: null, // No hay filas en GeneralZone
      seat: null, // No hay asientos en GeneralZone
      price,
      name,
      dni,
      mail,
      phone
    });

    console.log(newTicket.id, name, mail, phone, dni, price, zoneId);
    const response = await payment(newTicket.id, name, mail, phone, dni, price, zoneId, showId);

    // **Paso 8: Retornar respuesta**
    return response;

  } catch (error) {
    console.error(`Error en buyGeneralTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};
