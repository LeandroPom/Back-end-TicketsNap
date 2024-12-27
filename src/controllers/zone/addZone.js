const fs = require('fs');
const path = require('path');
const { Zone } = require('../../db');

// **Controlador principal para actualizar o crear una zona**
module.exports = async ({ showId, updates, templateName }) => {
  try {
    const filePath = path.join(__dirname, `../../Templates/${templateName}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo JSON "${templateName}" no existe.`);
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const jsonTemplate = JSON.parse(jsonData);

    // Verificar duplicados en base a `date` y `time` de `presentation`
    const { date, time } = updates.presentation || {};
    if (!date || !time) {
      throw new Error('Las propiedades "date" y "time" son obligatorias en presentation.');
    }

    const existingZone = await Zone.findOne({
      where: {
        'presentation.date': date,
        'presentation.time': time,
      },
    });

    if (existingZone) {
      throw new Error(`Ya existe una zona con la fecha "${date}" y el horario "${time}".`);
    }

    // Modificar la plantilla con los datos proporcionados
    jsonTemplate.showId = showId;
    jsonTemplate.isTemplate = false; // Asegurar que no se marque como plantilla
    jsonTemplate.presentation = {
      ...jsonTemplate.presentation,
      ...updates.presentation,
    };

    // Actualizar divisiones y filas dentro de `location`
    jsonTemplate.location = jsonTemplate.location.map((division) => {
      // Buscar coincidencias en `updates.location`
      const update = updates.location.find((item) => item.division === division.division);
      if (update) {
        // Actualizar `generalPrice` si existe
        division.generalPrice = update.generalPrice || division.generalPrice;

        // Actualizar filas si existen en ambas partes
        if (division.rows && update.rows) {
          division.rows = division.rows.map((row) => {
            const rowUpdate = update.rows.find((item) => item.row === row.row);
            if (rowUpdate) {
              row.rowPrice = rowUpdate.rowPrice || row.rowPrice;
            }
            return row;
          });
        }
      }
      return division;
    });

    // Crear nuevo registro en la base de datos
    const newZone = await Zone.create(jsonTemplate);

    return newZone;

  } catch (error) {
    console.error('Error en el controlador addZone:', error);
    throw error;
  }
};
