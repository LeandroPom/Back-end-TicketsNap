const getTicketById = require('../../controllers/ticket/getTicketById');

module.exports = async (req, res) => {

  const { id } = req.params;
  console.log(`Solicitud para obtener el ticket con ID: ${id}`);

  try {

    const ticket = await getTicketById(id);

    return res.status(200).json(ticket);
    

  } catch (error) {

    return res.status(404).json({ error: error.message });
  }
};