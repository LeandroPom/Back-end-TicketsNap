require("dotenv").config(); 
const { MercadoPagoConfig, Payment } = require("mercadopago");
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
// console.log(MP_ACCESS_TOKEN)

// Configurar Mercado Pago con el Access Token
const client = new MercadoPagoConfig({
  access_token: MP_ACCESS_TOKEN, // Token desde .env
});

module.exports = async (ticketId, name, mail, phone, dni, price, zoneId, description, paymentId) => {
    try {

    const payment = new Payment(client);

    const paymentData = {
      transaction_amount: price,
      description,
      installments: 1,
      payment_method_id: paymentId,
      payer: {
        name,
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
        success: `http://localhost:3001/tickets/payment/success`,
        failure: `http://localhost:3001/tickets/payment/failure`,
        pending: `http://localhost:3001/tickets/payment/pending`,
      },
      auto_return: "approved",
      external_reference: `${ticketId}_${mail}_${zoneId}`,
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
        ],
        installments: 1,
      },
    };

    const result = await payment.create({ body: paymentData });

    return {
      init_point: result.body.init_point,
      payment_id: result.body.id,
      payment_details: result.body,
    };

  } catch (error) {

    console.error("Error al crear el pago:", error);
    throw new Error("Error al procesar el pago.");
  }
};
