const giftTicket = require('../../controllers/ticket/giftTicket');

module.exports = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedTicket = await giftTicket(id);

        return res.status(200).json({
            message: "El ticket se regaló correctamente.",
            updatedTicket,
        });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
