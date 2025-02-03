require("dotenv").config(); 
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
// console.log(MP_ACCESS_TOKEN)

// Configurar Mercado Pago con el Access Token
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN, options: { timeout: 5000, idempotencyKey: 'abc' } });


module.exports = async (ticketId, name, mail, phone, dni, price, zoneId, description,cardToken) => {
    try {
    

    // Ajustar el campo name: eliminar espacios iniciales/finales y reemplazar espacios por "_"
    const sanitizedName = name.trim().replace(/\s+/g, "_");

    const title = "test ticket"


    const preference = new Preference(client);
    // const payment = new Payment(client);

    // Configurar los datos del cuerpo de la solicitud
    const body = {
      items: [
        {
          token: cardToken, // Token de la tarjeta (obtenido en el frontend)
          title: title,
          quantity: 1, // Siempre se compra un solo ticket
          unit_price: Number(price), // Precio unitario
          currency_id: "ARS", // Moneda en pesos argentinos
        },
      ],
      payer: {
        name: sanitizedName,
        email: mail.includes("@") ? mail : "test_user@mail.com", // Corregir si es inválido
        identification: {
          type: "DNI",
          number: dni,
        },
        phone: {
          number: phone,
        },
      },

      back_urls: {
        success: `${process.env.BACKEND_URLS}/tickets/payment/success`,
        failure: `${process.env.BACKEND_URLS}/tickets/payment/failure`,
        pending: `${process.env.BACKEND_URLS}/tickets/payment/pending`,
      },

      auto_return: "approved", // Retorno automático en pagos aprobados
      

      

      notification_url: `${process.env.FRONT_URL}/tickets/payment/notification`, // Notificaciones automáticas

      external_reference: `${ticketId}_${mail}`, // Referencia única para el ticket
      

      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" }, // Excluir pagos en efectivo
        ],
        installments: 1, // Solo una cuota
      },

    };

    // Crear la preferencia en Mercado Pago
    const result = await preference.create({ body });

    return {
      init_point: result.init_point, // URL para realizar el pago
      sandbox_init_point: result.sandbox_init_point, // URL para realizar el pago en sandbox
      payment_id: result.id, // ID del pago generado
      external_reference: result.external_reference, // refereancias externas 
      // payment_details: result // Objeto completo del pago
    };

  } catch (error) {
    console.error("Error al crear el pago:", error);

    // Mostrar mensaje detallado de error
    if (error.response && error.response.data) {
      throw new Error(`Error al procesar el pago: ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error("Error desconocido al procesar el pago.");
    }
  }
};