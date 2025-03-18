const { Ticket } = require('../../db');

module.exports = async (id) => {
    try {

        const ticket = await Ticket.findByPk(id);

        if (!ticket || !ticket.price) {
            throw { status: 404, message: 'price not found' };
        }

        // Regalar el ticket cambiando price a 0
        await Ticket.update({ price: 0 }, { where: { id } });

        // Obtener el ticket actualizado
        const updatedTicket = await Ticket.findByPk(id);

        return updatedTicket;
        
    } catch (error) {
        console.error("❌ Error en giftTicketController:", error.message);
        throw { status: error.status || 500, message: error.message || 'Error processing QR code' };
    }
};
