require("dotenv").config();
const { Ticket, Show, Zone, GeneralZone } = require("../../db");
const filterZone = require("../zone/filterZone");
const payment = require("../mercadoPago/payment");
const QRCode = require("qrcode");
const sendTicketsEmail = require("../mailer/sendTicketEmail");
const seatManager = require("./seatManager");

module.exports = async (tickets = [], service) => {
  try {
    let totalPrice = 0;
    let createdTickets = [];
    let mpTicketIds = [];

    /**
     * -----------------------------------------------------------
     * 馃敼 Validaci贸n previa para compras m煤ltiples
     * -----------------------------------------------------------
     * Agrupamos tickets por:
     * - zoneId
     * - division
     * para validar capacidad disponible antes de crear tickets
     */
    const groupedTickets = {};

    for (const ticket of tickets) {
      const key = `${ticket.zoneId}-${ticket.division}`;

      if (!groupedTickets[key]) {
        groupedTickets[key] = [];
      }

      groupedTickets[key].push(ticket);
    }

    /**
     * -----------------------------------------------------------
     * 馃敼 Verificar operaciones posibles por grupo
     * -----------------------------------------------------------
     */
    for (const key in groupedTickets) {
      const group = groupedTickets[key];
      const sampleTicket = group[0];

      const { zoneId, division, row, seatId } = sampleTicket;

      const zone = await Zone.findByPk(zoneId);
      const generalZone = await GeneralZone.findByPk(zoneId);

      // 馃敼 Solo validar capacidad para zonas generales
      if (!(row || seatId)) {

        let availableOperations = 0;

        // 馃敼 Tribunas Generales
        if (zone && division === "Tribunas Generales") {

          const tribunaData = await filterZone(zoneId, division);
          const tribunaInfo = tribunaData?.[0];

          if (!tribunaInfo) {
            throw new Error(`Divisi贸n "${division}" no encontrada.`);
          }

          availableOperations =
            Number(tribunaInfo.space) - Number(tribunaInfo.occupied);

        }
        // 馃敼 GeneralZone
        else if (generalZone) {

          const divisionData = generalZone.location.find(
            d => d.division === division
          );

          if (!divisionData) {
            throw new Error(`Divisi贸n general "${division}" no encontrada.`);
          }

          availableOperations =
            Number(divisionData.space) - Number(divisionData.occupied);

        }

        const ticketsRequested = group.length;

        // 馃敼 Validaci贸n principal solicitada
        if (availableOperations <= 0) {
          throw new Error(
            `No hay espacios disponibles en la divisi贸n "${division}".`
          );
        }

        // 馃敼 Validaci贸n compra m煤ltiple
        if (availableOperations < ticketsRequested) {
          throw new Error(
            `Los espacios disponibles no son suficientes para realizar la operaci贸n en la divisi贸n "${division}".`
          );
        }
      }
    }

    for (const ticket of tickets) {
      const {
        showId, zoneId, division, row, seatId, price,
        name, dni, mail, phone, userId,
      } = ticket;

      const show = await Show.findByPk(showId);
      if (!show) throw new Error(`Show con ID "${showId}" no encontrado.`);

      const zone = await Zone.findByPk(zoneId);
      const generalZone = await GeneralZone.findByPk(zoneId);

      let validPrice;
      let rowValue = null;
      let seatValue = null;

      // Validaciones de precio y disponibilidad
      if (row || seatId) {
        if (!zone) throw new Error(`Zona no encontrada para asiento con fila/asiento definido.`);

        const seatData = await filterZone(zoneId, division, row, seatId);
        const seatInfo = seatData?.[0];

        if (!seatInfo || seatInfo.taken)
          throw new Error(`Asiento ${seatId} ocupado o inexistente.`);

        if (zone.generalTicket) {
          const divisionData = await filterZone(zoneId, division);
          validPrice = Number(divisionData?.[0]?.generalPrice);
        } else {
          const rowData = await filterZone(zoneId, division, row);
          validPrice = Number(rowData?.[0]?.rowPrice);
        }

        if (Number(price) !== validPrice)
          throw new Error(`Precio incorrecto para asiento.`);

        rowValue = row;
        seatValue = seatId;

      } else if (zone && division === "Tribunas Generales") {

        const tribunaData = await filterZone(zoneId, division);
        const tribunaInfo = tribunaData?.[0];

        if (!tribunaInfo)
          throw new Error(`Divisi贸n "${division}" inexistente.`);

        /**
         * -----------------------------------------------------------
         * 馃敼 Nueva l贸gica de operaciones posibles
         * -----------------------------------------------------------
         */
        const availableOperations =
          Number(tribunaInfo.space) - Number(tribunaInfo.occupied);

        if (availableOperations <= 0)
          throw new Error(`Sin espacio en la divisi贸n "${division}".`);

        validPrice = Number(tribunaInfo.generalPrice);

        if (Number(price) !== validPrice)
          throw new Error(`Precio inv谩lido para la divisi贸n "${division}".`);

      } else if (generalZone) {

        const divisionData = generalZone.location.find(
          d => d.division === division
        );

        if (!divisionData)
          throw new Error(`Divisi贸n general "${division}" inexistente.`);

        /**
         * -----------------------------------------------------------
         * 馃敼 Nueva l贸gica de operaciones posibles
         * -----------------------------------------------------------
         */
        const availableOperations =
          Number(divisionData.space) - Number(divisionData.occupied);

        if (availableOperations <= 0)
          throw new Error(`Sin espacio en la divisi贸n general "${division}".`);

        validPrice = Number(divisionData.price);

        if (Number(price) !== validPrice)
          throw new Error(`Precio inv谩lido para zona general.`);
      }

      // 馃敼 Calcular chargePrice usando serviceCharge (%)
      const basePrice = Number(price);
      const serviceCharge = Number(show.serviceCharge);

      const chargePrice = Number(
        (basePrice + (basePrice * serviceCharge / 100)).toFixed(2)
      );

      // Creaci贸n del ticket (por show)
      const presentation = show.presentation?.[0];

      if (!presentation) {
        throw new Error(`El show no tiene presentaciones.`);
      }

      // 馃敼 Datos de la presentaci贸n
      const date = new Date(presentation.date)
        .toISOString()
        .split("T")[0];

      const time = presentation.time;
      const func = presentation.performance;

      const ticketData = {
        userId,
        zoneId,
        showId,
        division,
        state: false,
        location: show.location,
        date: `${date} || ${time.start} - ${time.end}`,
        function: func,
        row: rowValue,
        seat: seatValue,
        price,
        name,
        dni,
        mail,
        phone,
        chargePrice
      };

      const newTicket = await Ticket.create(ticketData);

      totalPrice += Number(price);

      mpTicketIds.push(newTicket.id);

      if (service === "CASH") {

        await Ticket.update(
          { state: true },
          { where: { id: newTicket.id } }
        );

        const qrUrl = `${process.env.FRONTEND_URL}/tickets/useQR/${newTicket.id}`;

        const qrCode = await QRCode.toDataURL(qrUrl);

        await Ticket.update(
          { qrCode },
          { where: { id: newTicket.id } }
        );

        createdTickets.push({
          ...ticketData,
          id: newTicket.id,
          qrCode,
          state: true,
          showName: show.name,
        });
      }
    }

    if (service === "MP") {
      const { name, mail, phone, dni, zoneId, showId } = tickets[0];

      return await payment(
        mpTicketIds,
        name,
        mail,
        phone,
        dni,
        totalPrice,
        zoneId,
        showId
      );
    }

    if (service === "CASH" && createdTickets.length > 0) {

      const ticketObjects = mpTicketIds.map(id => ({
        ticketId: id
      }));

      await seatManager(ticketObjects, "buy");

      // await sendTicketsEmail(createdTickets);
    }

    return createdTickets;

  } catch (error) {

    console.error("Error en salesTicketController:", error.message);

    throw new Error(error.message);
  }
};