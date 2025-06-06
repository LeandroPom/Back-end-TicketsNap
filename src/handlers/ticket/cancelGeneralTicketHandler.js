const cancelGeneralTicket = require('../../controllers/ticket/cancelGeneralTicket');

module.exports = async (req, res) => {
  try {
    // **Paso 1: Extraer el ticketId de los parámetros**
    const { ticketId } = req.params; 
    console.log(`Cancelando ticket con ID: ${ticketId}`);

    // **Paso 2: Validar que el ticketId fue proporcionado**
    if (!ticketId) {
      return res.status(400).json({
        error: 'Debes proporcionar el ID del ticket que deseas cancelar.'
      });
    }

    // **Paso 3: Ejecutar el controlador para cancelar el ticket**
    const result = await cancelGeneralTicket(ticketId);

    // **Paso 4: Enviar respuesta exitosa al cliente**
    return res.status(200).json({ message: result.message });

  } catch (error) {
    // **Paso 5: Manejar errores y enviar respuesta adecuada**
    console.error('❌ Error en cancelTicketHandler:', error.message);

    return res.status(500).json({
      error: 'No se pudo cancelar el ticket.',
      details: error.message
    });
  }
};
