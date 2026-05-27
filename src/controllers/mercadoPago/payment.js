require("dotenv").config();
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const { Show } = require("../../db"); // ✅ Importar modelo Show

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// Configurar Mercado Pago con el Access Token
const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
  options: { timeout: 5000, idempotencyKey: 'abc' }
});

module.exports = async (ticketId, name, mail, phone, dni, price, zoneId, showId, description) => {
  try {

    /**
     * -----------------------------------------------------------
     * 1️⃣ Sanitizar nombre del payer
     * -----------------------------------------------------------
     */
    const sanitizedName = name.trim().replace(/\s+/g, "_");


    /**
     * -----------------------------------------------------------
     * 2️⃣ Recuperar Show desde DB para obtener serviceCharge
     * -----------------------------------------------------------
     */
    const show = await Show.findByPk(showId);

    if (!show) {
      throw new Error(`Show con id ${showId} no encontrado`);
    }



    /**
     * -----------------------------------------------------------
     * 3️⃣ Calcular precio final usando serviceCharge (%)
     * -----------------------------------------------------------
     */

    const serviceCharge = Number(show.serviceCharge);

    const finalPrice = Number(
      (Number(price) * (1 + serviceCharge / 100)).toFixed(2)
    );


    const title = "test ticket";

    const preference = new Preference(client);


    /**
     * -----------------------------------------------------------
     * 4️⃣ Configuración del cuerpo de la preferencia MP
     * -----------------------------------------------------------
     */
    const body = {
      items: [
        {
          title: title,
          quantity: 1,
          unit_price: finalPrice,
          currency_id: "ARS",
        },
      ],

      payer: {
        name: sanitizedName,
        email: mail,
        identification: {
          type: "DNI",
          number: dni,
        },
        phone: {
          number: phone,
        },
      },

      back_urls: {
        success: `${process.env.BACKEND_URL_NG}/api/payments/success`,
        failure: `${process.env.BACKEND_URL_NG}/api/payments/failure`,
        pending: `${process.env.BACKEND_URL_NG}/api/payments/pending`,
      },

      auto_return: "approved",

      notification_url: `${process.env.BACKEND_URL_NG}/api/payments/notification`,

      external_reference: `ticketId: ${ticketId}, zoneId: ${zoneId}, showId: ${showId}, mail: ${mail}`,

      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
        ],
      },
    };


    /**
     * -----------------------------------------------------------
     * 5️⃣ Crear preferencia de pago en MercadoPago
     * -----------------------------------------------------------
     */
    const result = await preference.create({ body });


    /**
     * -----------------------------------------------------------
     * 6️⃣ Retornar datos necesarios para el frontend
     * -----------------------------------------------------------
     */
    return {
      init_point: result.init_point,
      payment_id: result.id,
      external_reference: result.external_reference,
    };

  } catch (error) {

    console.error("Error al crear el pago:", error);

    if (error.response && error.response.data) {
      throw new Error(`Error al procesar el pago: ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error("Error desconocido al procesar el pago.");
    }

  }
};