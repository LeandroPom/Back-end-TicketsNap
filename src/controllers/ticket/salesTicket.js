// controllers/ticket/salesTicket.js
require("dotenv").config();
const { Ticket, Show, Zone, GeneralZone } = require("../../db");
const filterZone = require("../zone/filterZone");
const payment = require("../mercadoPago/payment");
const QRCode = require("qrcode");
const seatManager = require("./seatManager");

module.exports = async (tickets = [], service) => {
  try {
    // **Variables generales de la operación**
    let totalPrice = 0;
    const createdTickets = [];
    const mpTicketIds = [];

    // **Agrupar espacios para validar capacidad total solicitada**
    const groups = tickets.reduce((groups, ticket) => {
      const key = `${ticket.zoneId}-${ticket.division}`;
      (groups[key] ||= []).push(ticket);
      return groups;
    }, {});

    // **Validar capacidad de divisiones generales antes de crear tickets**
    for (const group of Object.values(groups)) {
      const { zoneId, division, row, seatId } = group[0];

      // **Solo aplica a espacios sin fila/asiento**
      if (row || seatId) continue;

      const zone = await Zone.findByPk(zoneId);
      const generalZone = await GeneralZone.findByPk(zoneId);

      // **Buscar división general en Zone o GeneralZone**
      const divisionInfo = zone
        ? (await filterZone(zoneId, division))[0]
        : generalZone?.location?.find(
            (div) => div.division === division
          );

      if (!divisionInfo)
        throw new Error(
          `División "${division}" no encontrada.`
        );

      // **Validar capacidad disponible**
      const available =
        Number(divisionInfo.space) -
        Number(divisionInfo.occupied || 0);

      if (available < group.length)
        throw new Error(
          `No hay suficientes espacios disponibles en la división "${division}".`
        );
    }

    // **Procesar y crear tickets**
    for (const ticket of tickets) {
      const {
        showId,
        zoneId,
        division,
        row,
        seatId,
        price,
        name,
        dni,
        mail,
        phone,
        userId,
      } = ticket;

      // **Recuperar show y posibles zonas**
      const [show, zone, generalZone] = await Promise.all([
        Show.findByPk(showId),
        Zone.findByPk(zoneId),
        GeneralZone.findByPk(zoneId),
      ]);

      if (!show)
        throw new Error(
          `Show con ID "${showId}" no encontrado.`
        );

      // **Valores normalizados para el ticket**
      let rowValue = row || null;
      let seatValue = seatId || null;
      let validPrice;

      // **Validar asiento**
      if (row || seatId) {
        if (!zone)
          throw new Error(
            `Zona "${zoneId}" no encontrada para el asiento.`
          );

        const seat = (
          await filterZone(
            zoneId,
            division,
            row,
            seatId
          )
        )[0];

        if (!seat || seat.taken)
          throw new Error(
            `Asiento "${seatId}" ocupado o inexistente.`
          );

        // **Precio general o precio específico de fila**
        validPrice = zone.generalTicket
          ? Number(
              (await filterZone(zoneId, division))[0]
                ?.generalPrice
            )
          : Number(
              (await filterZone(zoneId, division, row))[0]
                ?.rowPrice
            );

        if (Number(price) !== validPrice)
          throw new Error(
            `Precio incorrecto para asiento "${seatId}".`
          );
      }

      // **Validar espacio general**
      else {
        const divisionInfo = zone
          ? (await filterZone(zoneId, division))[0]
          : generalZone?.location?.find(
              (div) => div.division === division
            );

        if (!divisionInfo)
          throw new Error(
            `División "${division}" no encontrada.`
          );

        // **Obtener precio configurado en la división**
        validPrice = Number(
          divisionInfo.generalPrice ??
            divisionInfo.price
        );

        if (Number(price) !== validPrice)
          throw new Error(
            `Precio inválido para la división "${division}".`
          );
      }

      // **Información de presentación**
      const presentation =
        show.presentation?.[0];

      if (!presentation)
        throw new Error(
          `El show "${showId}" no tiene presentaciones.`
        );

      const date = new Date(presentation.date)
        .toISOString()
        .split("T")[0];

      const { time, performance } = presentation;

      // **Calcular precio final según servicio**
      const basePrice = Number(price);
      const chargePrice =
        service === "CASH"
          ? basePrice
          : Number(
              (
                basePrice +
                (basePrice *
                  Number(show.serviceCharge)) /
                  100
              ).toFixed(2)
            );

      // **Crear ticket**
      const ticketData = {
        userId,
        zoneId,
        showId,
        division,
        state: false,
        location: show.location,
        date: `${date} || ${time.start} - ${time.end}`,
        function: performance,
        row: rowValue,
        seat: seatValue,
        price,
        name,
        dni,
        mail,
        phone,
        chargePrice,
      };

      const newTicket = await Ticket.create(
        ticketData
      );

      totalPrice += basePrice;
      mpTicketIds.push(newTicket.id);

      // **Confirmar ticket y generar QR para operaciones directas**
      if (
        service === "CASH" ||
        service === "OTHER"
      ) {
        const qrCode = await QRCode.toDataURL(
          `${process.env.FRONTEND_URL}/tickets/useQR/${newTicket.id}`
        );

        await Ticket.update(
          {
            state: true,
            qrCode,
          },
          {
            where: { id: newTicket.id },
          }
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

    // **Mercado Pago: enviar tickets al proceso de pago**
    if (service === "MP") {
      const {
        name,
        mail,
        phone,
        dni,
        zoneId,
        showId,
      } = tickets[0];

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

    // **Ocupar asientos/espacios después de crear tickets**
    if (
      (service === "CASH" ||
        service === "OTHER") &&
      mpTicketIds.length
    ) {
      await seatManager(
        mpTicketIds.map((ticketId) => ({
          ticketId,
        })),
        "buy"
      );
    }

    return createdTickets;
  } catch (error) {
    // **Error centralizado de venta**
    console.error(
      `❌ Error en salesTicketController: ${error.message}`
    );

    throw new Error(
      `Error en salesTicketController: ${error.message}`
    );
  }
};
