const { Ticket, Show, Zone } = require('../../db');
const filterZone = require('../../controllers/zone/filterZone');

module.exports = async (showId, zoneId, division, row, seatId, price, userId) => {
  try {
    // **Paso 1: Validar Show**
    const show = await Show.findByPk(showId);
    if (!show) throw new Error(`El show con ID "${showId}" no existe.`);

    // **Paso 2: Validar Zona**
    const zone = await Zone.findByPk(zoneId);
    if (!zone) throw new Error(`La zona con ID "${zoneId}" no existe.`);

    // **Paso 3: Filtrar la Zona con filterZone() para obtener el asiento**
    const seatData = await filterZone(zoneId, division, row, seatId);

    if (!seatData || seatData.length === 0) {
      throw new Error(`El asiento con ID "${seatId}" no se encontró en la división "${division}" y fila "${row}".`);
    }

    const seatInfo = seatData[0];

    // **Paso 4: Validar si el asiento ya está ocupado**
    if (seatInfo.taken) {
      throw new Error(`El asiento con ID "${seatId}" ya ha sido vendido.`);
    }

    // **Paso 5: Definir validPrice utilizando filterZone() para obtener el rowPrice**
    let validPrice;

    if (zone.generalTicket) {
      // **Caso 1:** Validar contra generalPrice
      const divisionData = await filterZone(zoneId, division);
      validPrice = Number(divisionData[0]?.generalPrice);
    } else {
      // **Caso 2:** Validar contra rowPrice usando filterZone()
      const rowData = await filterZone(zoneId, division, row);
      if (!rowData || !rowData[0]?.rowPrice) {
        throw new Error(`No se encontró el precio para la fila "${row}" en la división "${division}".`);
      }

      validPrice = Number(rowData[0]?.rowPrice);
    }

    // **Paso 6: Validar el precio ingresado**
    if (Number(price) !== validPrice) {
      throw new Error(`El precio ingresado (${price}) no coincide con el precio registrado (${validPrice}).`);
    }

    // **Paso 7: Marcar el asiento como ocupado (taken: true)**
    const updatedLocation = zone.location.map(div => {
      if (div.division === division) {
        div.rows = div.rows.map(r => {
          if (r.row === row) {
            r.seats = r.seats.map(seat => {
              if (seat.id === seatId) {
                return { ...seat, taken: true };
              }
              return seat;
            });
          }
          return r;
        });
      }
      return div;
    });

    // **Paso 8: Actualizar la zona en la base de datos**
    await Zone.update(
      { location: updatedLocation },
      { where: { id: zoneId } }
    );

    // **Paso 9: Crear el Ticket**
    const newTicket = await Ticket.create({
      userId,
      zoneId,
      showId,
      division,
      state: true,
      location: "",
      date: zone.presentation.date,
      function: zone.presentation.performance,
      row,
      seat: seatId,
      price,
      // qrCode: 'QR_CODE_GENERATION_PENDING'
    });

    // **Paso 10: Retornar el Ticket**
    return newTicket;

  } catch (error) {
    console.error(`Error en sellTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};
