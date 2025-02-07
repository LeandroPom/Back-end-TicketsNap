const { Ticket, Show, Zone } = require('../../db');
const filterZone = require('../../controllers/zone/filterZone');
const payment = require('../mercadoPago/payment')

module.exports = async (showId, zoneId, division, row, seatId, price, name, dni, mail, phone, userId) => {
  try {
    // **Paso 1: Validar Show**
    const show = await Show.findByPk(showId);
    if (!show) throw new Error(`El show con ID "${showId}" no existe.`);

    // **Paso 2: Validar Zona**
    const zone = await Zone.findByPk(zoneId);
    if (!zone) throw new Error(`La zona con ID "${zoneId}" no existe.`);

    // **Paso 3: Inicializar variables de validación**
    let validPrice;
    let updatedLocation = [...zone.location]; // Clonamos la ubicación para actualizarla
    let rowValue = null;
    let seatValue = null;

    // **Paso 4: Lógica para "Tribunas Generales"**
    if (division === "Tribunas Generales") {
      const tribunaData = await filterZone(zoneId, division);
      if (!tribunaData || tribunaData.length === 0) {
        throw new Error(`La división "${division}" no existe en la zona.`);
      }

      const tribunaInfo = tribunaData[0];

      // Validar espacio disponible
      if (tribunaInfo.occupied >= tribunaInfo.space) {
        throw new Error(`Todos los espacios en "${division}" han sido vendidos.`);
      }

      // Validar el precio (siempre generalPrice)
      validPrice = Number(tribunaInfo.generalPrice);
      if (Number(price) !== validPrice) {
        throw new Error(`El precio ingresado (${price}) no coincide con el precio registrado (${validPrice}).`);
      }

      // Incrementar el contador de ocupados
      updatedLocation = updatedLocation.map(div => {
        if (div.division === division) {
          return { ...div, occupied: div.occupied + 1 };
        }
        return div;
      });

    } else {
      // **Paso 5: Lógica para divisiones con filas y asientos**

      // Filtrar asiento específico
      const seatData = await filterZone(zoneId, division, row, seatId);
      if (!seatData || seatData.length === 0) {
        throw new Error(`El asiento con ID "${seatId}" no se encontró en la división "${division}" y fila "${row}".`);
      }

      const seatInfo = seatData[0];

      // Validar si el asiento está ocupado
      if (seatInfo.taken) {
        throw new Error(`El asiento con ID "${seatId}" ya ha sido vendido.`);
      }

      // Validar el precio
      if (zone.generalTicket) {
        const divisionData = await filterZone(zoneId, division);
        validPrice = Number(divisionData[0]?.generalPrice);
      } else {
        const rowData = await filterZone(zoneId, division, row);
        validPrice = Number(rowData[0]?.rowPrice);
      }

      if (Number(price) !== validPrice) {
        throw new Error(`El precio ingresado (${price}) no coincide con el precio registrado (${validPrice}).`);
      }
    }

    rowValue = row;
    seatValue = seatId;

    // **Paso 6: Crear el Ticket (única creación)**
    const newTicket = await Ticket.create({
      userId,
      zoneId,
      showId,
      division,
      state: false,
      location: `${show.location}`,
      date: `${new Date(zone.presentation.date).toISOString().split('T')[0]} || ${zone.presentation.time.start} - ${zone.presentation.time.end}`,
      function: zone.presentation.performance,
      row: rowValue,
      seat: seatValue,
      price,
      name,
      dni,
      mail,
      phone
    });

    console.log(newTicket.id, name, mail, phone, dni, price, zoneId)
    const response = await payment(newTicket.id, name, mail, phone, dni, price, zoneId, showId)

    // **Paso 7: Retornar response**
    return response;

  } catch (error) {
    console.error(`Error en buyTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};