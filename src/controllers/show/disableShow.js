const { Show } = require('../../db');

module.exports = async (showId) => {
  try {
    console.log(`Cancelando show con ID: ${showId}`);

    // **Paso 1: Validar si el Show existe**
    const show = await Show.findByPk(showId);
    if (!show) {
      throw new Error(`El show con ID "${showId}" no existe.`);
    }

    // **Paso 2: Verificar si el show ya está desactivado**
    if (!show.state) {
      throw new Error(`El show con ID "${showId}" ya está desactivado.`);
    }

    // **Paso 3: Actualizar el estado del show a false (desactivado)**
    await show.update({ state: false });

    // **Paso 4: Confirmar la desactivación**
    return { message: `El show con ID "${showId}" fue desactivado correctamente.` };

  } catch (error) {
    console.error(`Error al cancelar el show: ${error.message}`);
    throw new Error(`Error al cancelar el show: ${error.message}`);
  }
};
