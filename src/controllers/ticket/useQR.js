const { Ticket } = require('../../db');

// Controller para usar QR
module.exports = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findByPk(id);

        if (!ticket || !ticket.qrCode) {
            return res.status(404).json({ message: 'QR code not found' });
        }

        if (!ticket.qrToken) {
            return res.status(400).json({ message: "Este QR ya fue utilizado." });
        }

        return res.status(200).json({ message: "Acceso concedido, QR validado correctamente.", ticket });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing QR code' });
    }
};
