const { Show } = require('../../db');

module.exports = async (showId) => {
  try {
    console.log(`Toggling show with ID: ${showId}`);

    // Validar si el Show existe
    const show = await Show.findByPk(showId);

    if (!show) {
      throw new Error(`El show con ID "${showId}" no existe.`);
    }

    // Si el show está activo, lo desactivamos; si está desactivado, lo activamos
    const updatedState = !show.state;  // Alternar el estado

    await show.update({ state: updatedState });

    return { message: `El show con ID "${showId}" fue ${updatedState ? 'activado' : 'desactivado'} correctamente.` };

  } catch (error) {
    
    console.error(`Error al cambiar el estado del show: ${error.message}`);
    throw new Error(`Error al cambiar el estado del show: ${error.message}`);
  }
};