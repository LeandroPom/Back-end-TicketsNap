
# **Payment Brick**

---

## **Crédito/Débito**

```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

const payment = new Payment(client);
payment.create({ body: req.body })
.then(console.log)
.catch(console.log);
```

---

## **Transferencia Bancária**

```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

const payment = new Payment(client);
payment.create({ body: req.body })
.then(console.log)
.catch(console.log);
```

---

## **Medios de pago en efectivo**

```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

const payment = new Payment(client);
payment.create({ body: req.body })
.then(console.log)
.catch(console.log);
```

---

## **Tarjetas**

### **Server-Side**

- **Envío de información al backend**:
  - Envía un `POST` con los atributos requeridos al endpoint `/v1/payments` usando nuestros SDKs.
  - **Importante**: Usar el atributo `X-Idempotency-Key` para asegurar reejecución sin duplicados.

```javascript
const mercadopago = require('mercadopago');
import { MercadoPagoConfig, Payment } from '@src/index';

const client = new MercadoPagoConfig({ accessToken: '<ACCESS_TOKEN>', options: { timeout: 5000 } });

const payment = new Payment(client);

payment
  .create({
    body: {
      transaction_amount: 100,
      token: '<TOKEN>',
      description: '<DESCRIPTION>',
      installments: 1,
      payment_method_id: '<PAYMENT_METHOD_ID>',
      issuer_id: 310,
      payer: {
        email: '<EMAIL>',
        identification: {
          number: '12345678909',
          type: 'CPF',
        },
      },
    },
  })
  .then(console.log)
  .catch(console.log);
```

---

## **Respuesta**

```json
{
  "status": "approved",
  "status_detail": "accredited",
  "id": 3055677,
  "date_approved": "2019-02-23T00:01:10.000-04:00",
  "payer": {...},
  "payment_method_id": "visa",
  "payment_type_id": "credit_card",
  "refunds": [],
  ...
}
```

---

## **Callback onSubmit**

- Incluye detalles adicionales como:
  - `description`: Campo mostrado en tickets.
  - `external_reference`: ID de compra en tu sitio web.

### **Recomendaciones**
- **Adherirse al protocolo 3DS 2.0** para mayor aprobación.
- Consultar las **Referencias de API** para campos disponibles.

---

## **Cuenta de Mercado Pago y Cuotas sin Tarjeta**

### **Server-Side**

- Opción de pagar en cuotas sin tarjeta no requiere backend.
- Se redirige al sitio de Mercado Pago con `preferenceId`.

```javascript
const settings = {
  initialization: {
    amount: 100,
    preferenceId: "<PREFERENCE_ID>",
    marketplace: true,
  },
};
```

---

## **Marketplace**

1. Crear un `access_token` para cada vendedor.
2. Configurar en Bricks:
   ```javascript
   const settings = {
     initialization: {
       amount: 100,
       preferenceId: "<PREFERENCE_ID>",
       marketplace: true,
     },
   };
   ```
3. Usar la `public_key` en el frontend y `access_token` del vendedor en el backend.
4. Configurar `marketplace_fee` para establecer comisiones.

---

## **Otros medios de pago**

### **Server-Side**

- **Ejemplo con Rapipago o Pago Fácil**:
  ```javascript
  import { Payment, MercadoPagoConfig } from 'mercadopago';

  const client = new MercadoPagoConfig({ accessToken: '<ACCESS_TOKEN>' });

  payment.create({
    body: {
      transaction_amount: req.transaction_amount,
      token: req.token,
      description: req.description,
      installments: req.installments,
      payment_method_id: req.paymentMethodId,
      issuer_id: req.issuer,
      payer: {
        email: req.email,
        identification: {
          type: req.identificationType,
          number: req.number,
        },
      },
    },
    requestOptions: { idempotencyKey: '<SOME_UNIQUE_VALUE>' },
  })
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
  ```

---

## **Mostrar estado de pago**

1. Crear el pago en backend.
2. Usar el ID para instanciar `Status Screen Brick`.
3. Configurar fecha de vencimiento con `date_of_expiration`.

```javascript
settings = {
  ...,
  initialization: {
    payer: {
      email: '<PAYER_EMAIL_HERE>',
      identification: {
        type: 'string',
        number: 'string',
      },
    },
  },
};
```

---

- Integrar correctamente `back_urls` para redireccionar usuarios.


# **Configuraciones de Preferencia**

Puedes adaptar la integración de Payment Brick a tu modelo de negocio configurando atributos de preferencia.

- Si ofreces compras de alto valor, puedes:
  - Aceptar pagos con dos tarjetas de crédito.
  - Eliminar métodos de pago no deseados para tu operación.

---

## **Ejemplo de Preferencia Completa**

```json
{
    "items": [
        {
            "id": "item-ID-1234",
            "title": "Mi producto",
            "currency_id": "BRL",
            "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
            "description": "Descrição do Item",
            "category_id": "art",
            "quantity": 1,
            "unit_price": 75.76
        }
    ],
    "payer": {
        "name": "Juan",
        "surname": "Lopez",
        "email": "user@email.com",
        "phone": {
            "area_code": "11",
            "number": 4444-4444
        },
        "identification": {
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "5700"
        }
    },
    "back_urls": {
        "success": "https://www.success.com",
        "failure": "http://www.failure.com",
        "pending": "http://www.pending.com"
    },
    "auto_return": "approved",
    "payment_methods": {
        "excluded_payment_methods": [
            {
                "id": "master"
            }
        ],
        "excluded_payment_types": [
            {
                "id": "ticket"
            }
        ],
        "installments": 12
    },
    "notification_url": "https://www.your-site.com/ipn",
    "statement_descriptor": "MINEGOCIO",
    "external_reference": "Reference_1234",
    "expires": true,
    "expiration_date_from": "2016-02-01T12:00:00.000-04:00",
    "expiration_date_to": "2016-02-28T12:00:00.000-04:00"
}
```

---

## **Define los Medios de Pago**

Puedes configurar un método de pago predeterminado, eliminar los no deseados o limitar la cantidad de cuotas.

### **Atributos**

| **Atributo**               | **Descripción**                                                                 |
|-----------------------------|---------------------------------------------------------------------------------|
| `payment_methods`           | Clase que describe los métodos y atributos de medios de pago de Payment Brick. |
| `excluded_payment_types`    | Excluye tipos de medios de pago no deseados como Rapipago o Pago Fácil.         |
| `excluded_payment_methods`  | Excluye marcas de tarjetas de crédito o débito, como Visa o Mastercard.         |
| `installments`              | Define la cantidad de cuotas máximas a ofrecer.                                |
| `purpose`                   | Define el valor `wallet_purchase` para aceptar pagos solo de usuarios registrados. |

Ejemplo:

```javascript
var preference = {};
preference = {
  "payment_methods": {
    "excluded_payment_methods": [
      {
        "id": "master"
      }
    ],
    "excluded_payment_types": [
      {
        "id": "ticket"
      }
    ],
    "installments": 12
  }
};
```

---

## **Acepta Pagos con Dos Tarjetas de Crédito**

Puedes activar esta opción desde tu cuenta de Mercado Pago en las opciones de negocio.

---

## **Acepta Pagos Solo de Usuarios Registrados**

Para aceptar pagos exclusivamente de usuarios registrados con billetera de Mercado Pago:

```json
{
    "purpose": "wallet_purchase",
    "items": [
        {
            "title": "Mi producto",
            "quantity": 1,
            "unit_price": 75.76
        }
    ]
}
```

**Importante**: No podrás recibir pagos de usuarios no registrados o en efectivo.

---

## **Cambia la Fecha de Vencimiento para Pagos en Efectivo**

Puedes ajustar el vencimiento con el atributo `date_of_expiration`:

```json
"date_of_expiration": "2020-05-30T23:59:59.000-04:00"
```

**Nota**: Configura la fecha con al menos 3 días de margen.

---

## **Activa el Modo Binario**

Para aprobación instantánea, configura `binary_mode` como `true`:

```json
"binary_mode": true
```

**Nota**: Esto puede reducir la tasa de aprobación de pagos.

---

## **Establece la Vigencia de Preferencias**

Usa los atributos `expires`, `expiration_date_from` y `expiration_date_to` para definir la duración.

```json
"expires": true,
"expiration_date_from": "2017-02-01T12:00:00.000-04:00",
"expiration_date_to": "2017-02-28T12:00:00.000-04:00"
```

---

## **Establece una Preferencia para Múltiples Ítems**

Ejemplo:

```javascript
var preference = {
  items: [
    {
      title: "Mi producto",
      quantity: 1,
      currency_id: "ARS",
      unit_price: 75.56
    },
    {
      title: "Mi producto 2",
      quantity: 2,
      currency_id: "ARS",
      unit_price: 96.56
    }
  ]
};
```

---

## **Muestra el Monto del Envío**

Configura el nodo `shipments` para mostrar el costo del envío:

```json
"shipments": {
  "cost": 1000,
  "mode": "not_specified"
}
}
```

---

## **Redirige al Comprador a Tu Sitio Web**

Usa `back_urls` para redirección según el estado del pago:

```json
"back_urls": {
  "success": "https://www.tu-sitio/success",
  "failure": "http://www.tu-sitio/failure",
  "pending": "http://www.tu-sitio/pending"
},
"auto_return": "approved"
```

---


# **Incluir Tarjetas Guardadas**

## **Client-Side**

Para que Payment Brick pueda mostrar las tarjetas guardadas de un comprador, es necesario enviar el ID del cliente (`customerId`) y los IDs de las tarjetas (`cardsIds`) al inicializar el Brick:

```javascript
const settings = {
   initialization: {
       ...,
       payer: {
           ...,
           customerId: '209277402-FqRqgEc3XItrxs',
           cardsIds: ['1518023392627', '1518023332143']
       },
   },
   ...
}
```

**Atención**: Solo se mostrarán tarjetas no caducadas.

---

## **Actualizar Datos**

Puedes usar el método `update` para actualizar datos en el Brick:

### **Datos Disponibles para Actualización**

| Campo  | Tipo   | Descripción                                                                                              |
|--------|--------|----------------------------------------------------------------------------------------------------------|
| amount | number | Monto del pago. La validación verifica que el nuevo valor sea mayor o igual al mínimo permitido.          |

Ejemplo:

```javascript
let amount = 95;
paymentBrickController.update({ amount });
```

---

## **Administrar Medios de Pago**

Para ajustar los medios de pago aceptados:

```javascript
const settings = {
   ...,
   customization: {
       paymentMethods: {
           creditCard: "all",  // Activar todas las tarjetas de crédito disponibles
       },
   },
}
```

### **Medios de Pago Disponibles**

| **paymentMethods** | **Tipo**       | **Valores Posibles**                                                                       |
|---------------------|----------------|-------------------------------------------------------------------------------------------|
| creditCard          | string[]       | Consulte la API para conocer las tarjetas disponibles.                                    |
| debitCard           | string[]       | Consulte la API para conocer las tarjetas disponibles.                                    |
| mercadoPago         | string[]       | `['onboarding_credits', 'wallet_purchase']`                                              |
| ticket              | string[]       | `['pagofacil', 'rapipago']`                                                               |

---

## **Configurar Cuotas**

Puedes limitar la cantidad de cuotas al personalizar Brick:

```javascript
const settings = {
    ...,
    customization: {
        paymentMethods: {
            minInstallments: 1,  // Mínimo de cuotas
            maxInstallments: 12 // Máximo de cuotas
        },
    },
}
```

---

## **Método de Pago por Defecto**

Inicializa Payment Brick con un método de pago predeterminado:

```javascript
const settings = {
   ...,
   customization: {
       visual: {
           defaultPaymentOption: {
               walletForm: true,  // Habilitar la billetera
           },
       },
   },
}
```

**Atención**: Solo puede haber un método de pago predeterminado.

---

## **Datos Adicionales**

En el callback `onSubmit`, puedes acceder a `additionalData`:

### **Campos Disponibles**

| **Campo**         | **Tipo** | **Descripción**                                  |
|--------------------|----------|--------------------------------------------------|
| bin               | string   | BIN de la tarjeta ingresada.                     |
| lastFourDigits    | string   | Últimos cuatro dígitos de la tarjeta.            |
| cardholderName    | string   | Nombre del titular de la tarjeta.                |

Ejemplo:

```javascript
const settings = {
   ...,
   callbacks: {
       onSubmit: ({ selectedPaymentMethod, formData }, additionalData) => {
           console.log(additionalData);
       },
   },
}
```

---

## **Callbacks Adicionales**

### **onBinChange**

Obtén el BIN de la tarjeta cada vez que el usuario lo actualice:

```javascript
const settings = {
   ...,
   callbacks: {
       onBinChange: (bin) => {
           console.log(bin);
       },
   },
}
```

**Atención**: Solo confía en el BIN después de activar el evento `onSubmit`.

---

## **Wallet Brick**

Ejemplo de integración para pagos exclusivos de usuarios registrados:

```javascript
const preference = new Preference(client);

preference.create({
  body: {
    items: [
      {
        title: 'My product',
        quantity: 1,
        unit_price: 2000
      }
    ],
    purpose: 'wallet_purchase'  // Solo pagos de usuarios registrados
  }
})
.then(console.log)
.catch(console.log);
```
---

# Configuraciones de Preferencia

Puedes adaptar la integración de **Wallet Brick** a tu modelo de negocio configurando atributos de preferencia.

> **Ejemplo:**  
> Si ofreces compras de alto valor, puedes aceptar pagos con dos tarjetas de crédito o eliminar métodos de pago no deseados para tu operación.

## Ejemplo de Preferencia Completa

```json
{
    "items": [
        {
            "id": "item-ID-1234",
            "title": "Mi producto",
            "currency_id": "ARS",
            "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
            "description": "Descripción del Item",
            "category_id": "art",
            "quantity": 1,
            "unit_price": 75.76
        }
    ],
    "payer": {
        "name": "Juan",
        "surname": "Lopez",
        "email": "user@email.com",
        "phone": {
            "area_code": "11",
            "number": "4444-4444"
        },
        "identification": {
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "5700"
        }
    },
    "back_urls": {
        "success": "https://www.success.com",
        "failure": "http://www.failure.com",
        "pending": "http://www.pending.com"
    },
    "auto_return": "approved",
    "payment_methods": {
        "excluded_payment_methods": [
            {
                "id": "master"
            }
        ],
        "excluded_payment_types": [
            {
                "id": "ticket"
            }
        ],
        "installments": 12
    },
    "notification_url": "https://www.your-site.com/ipn",
    "statement_descriptor": "MINEGOCIO",
    "external_reference": "Reference_1234",
    "expires": true,
    "expiration_date_from": "2016-02-01T12:00:00.000-04:00",
    "expiration_date_to": "2016-02-28T12:00:00.000-04:00"
}
```

---

## Financiación Sin Tarjeta

Con **Mercado Pago** es posible pagar hasta en 12 cuotas sin tarjeta de crédito, a través de la opción **Cuotas sin Tarjeta**.

- Los clientes podrán comprar un producto hoy y pagarlo después en cuotas.  
- La aprobación de la compra es inmediata y garantizada.  
- El importe íntegro se abona por adelantado y tus clientes lo pagan después.

### Cómo Configurar Pagos con Cuotas sin Tarjeta

1. Crea una preferencia enviando un `POST` con el parámetro `purpose` y el valor `onboarding_credits` al endpoint `/checkout/preferences`.
2. Usa uno de los SDKs disponibles, si prefieres.

Ejemplo de configuración:

```javascript
// Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: 'Mi producto',
      unit_price: 100,
      quantity: 1,
    }
  ],
  purpose: 'onboarding_credits'
};

mercadopago.preferences.create(preference)
  .then(function(response){
    global.id = response.body.id; // Sustituye <%= global.id %> en tu HTML
  })
  .catch(function(error){
    console.log(error);
  });
```

---

## Define los Medios de Pago

Puedes configurar preferencias para:

- **Métodos de pago predeterminados**.
- **Excluir métodos no deseados**.
- **Definir el número máximo de cuotas disponibles**.

### Atributos y Descripciones

| **Atributo**            | **Descripción**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| `payment_methods`        | Clase que describe los métodos y atributos de medios de pago de Wallet Brick.   |
| `excluded_payment_types` | Excluye tipos de medios de pago no deseados (e.g., Rapipago, Pago Fácil).       |
| `excluded_payment_methods` | Excluye marcas de tarjetas específicas (e.g., Visa, Mastercard).               |
| `installments`           | Define la cantidad máxima de cuotas.                                           |
| `purpose`                | Solo permite pagos con usuarios registrados y con saldo/tarjetas disponibles.  |

#### Ejemplo

```javascript
var preference = {
  "payment_methods": {
    "excluded_payment_methods": [
        { "id": "master" }
    ],
    "excluded_payment_types": [
        { "id": "ticket" }
    ],
    "installments": 12
  }
};
```

---

## Acepta Pagos con Dos Tarjetas de Crédito

Puedes activar esta opción desde tu cuenta de Mercado Pago:

1. Ve a **Opciones de Negocio**.  
2. Activa la opción **Recibir pagos con 2 tarjetas de crédito**.

---

## Más Opciones y Configuraciones

### Acepta Pagos Únicamente de Usuarios Registrados

Incluye el atributo `"purpose": "wallet_purchase"` para que solo se permitan pagos de usuarios registrados.

Ejemplo:

```json
{
    "purpose": "wallet_purchase",
    "items": [
        {
            "title": "Mi producto",
            "quantity": 1,
            "unit_price": 75.76
        }
    ]
}
```

---

### Cambiar Fecha de Vencimiento para Pagos en Efectivo

Usa el atributo `date_of_expiration` para configurar la fecha (formato ISO 8601).

Ejemplo:

```json
"date_of_expiration": "2020-05-30T23:59:59.000-04:00"
```

> **Nota:** Establece al menos 3 días hábiles para garantizar el pago.

---

### Activa el Modo Binario

Configura `"binary_mode": true` si necesitas aprobación instantánea.

> **Importante:** Esto puede disminuir el porcentaje de pagos aprobados, ya que los pagos pendientes serán rechazados automáticamente.

---

### Establece la Vigencia de Preferencias

Configura un período de validez con los atributos `expires`, `expiration_date_from` y `expiration_date_to`.

Ejemplo:

```json
"expires": true,
"expiration_date_from": "2017-02-01T12:00:00.000-04:00",
"expiration_date_to": "2017-02-28T12:00:00.000-04:00"
```

---

### Agregar Descripción en el Resumen de la Tarjeta

Usa el atributo `statement_descriptor` para mostrar una descripción en el resumen de la tarjeta:

```json
"statement_descriptor": "MINEGOCIO"
```

---

### Configura Preferencia para Múltiples Ítems

Ejemplo:

```javascript
var preference = {
  items: [
    { title: 'Producto 1', quantity: 1, currency_id: 'ARS', unit_price: 75.56 },
    { title: 'Producto 2', quantity: 2, currency_id: 'ARS', unit_price: 96.56 }
  ]
};
```

---

### Muestra el Monto del Envío

Configura el atributo `shipments` para detallar el costo del envío:

```json
{
    "shipments":{
        "cost": 1000,
        "mode": "not_specified"
    }
}
```

---

### Redirigir al Comprador a tu Sitio Web

Usa los atributos `back_urls` y `auto_return`:

```json
"back_urls": {
    "success": "https://www.tu-sitio/success",
    "failure": "http://www.tu-sitio/failure",
    "pending": "http://www.tu-sitio/pending"
},
"auto_return": "approved"
```

---


# Agregar Etapa de Confirmación

Después de completar los datos necesarios para procesar el pago, es posible mostrar al comprador un área de **revisión** con:

- Los elementos, valores y método de pago.
- La dirección de entrega.
- La dirección de facturación.

Esta etapa adicional mejora la experiencia del comprador, permitiendo revisar y editar la información antes de confirmar el pago.

---

## Integración de la Funcionalidad

Para habilitar esta funcionalidad, es necesario enviar información adicional al inicializar **Payment Brick**. A continuación, se muestra un ejemplo con la propiedad `enableReviewStep`, que habilita el flujo de revisión.

> **Atención:** Asegúrate de reemplazar los valores entre `<>`.

```javascript
const settings = {
  initialization: {
    amount: 23.14,
    items: {
      totalItemsAmount: 33.14,
      itemsList: [
        { units: 1, value: 3.14, name: "<NAME>", description: "<DESCRIPTION>", imageURL: "<IMAGE_URL>" },
        { units: 3, value: 10, name: "<NAME>", description: "<DESCRIPTION>", imageURL: "<IMAGE_URL>" },
      ],
    },
    shipping: { 
      costs: 5,
      shippingMode: "<SHIPPING_MODE>",
      description: "<SHIPPING_DESCRIPTION>",
      receiverAddress: { streetName: "<STREET_NAME>", streetNumber: "<STREET_NUMBER>", zipCode: "<ZIP_CODE>" },
    },
    payer: { email: "<EMAIL>" },
    billing: {
      firstName: "<FIRST_NAME>",
      taxIdentificationNumber: "<TAX_IDENTIFICATION_NUMBER>",
      billingAddress: { streetName: "<STREET_NAME>", streetNumber: "<STREET_NUMBER>", zipCode: "<ZIP_CODE>" },
    },
    discounts: {
      totalDiscountsAmount: 15,
      discountsList: [
        { name: "<DISCOUNT_NAME>", value: 5 },
        { name: "<DISCOUNT_NAME_2>", value: 10 },
      ],
    },
  },
  customization: {
    enableReviewStep: true,
    reviewCardsOrder: ["payment_method", "shipping", "billing"],
    paymentMethods: { ticket: "all", atm: "all", creditCard: "all", debitCard: "all", mercadoPago: "all" },
  },
  callbacks: {
    onReady: () => {},
    onSubmit: ({ selectedPaymentMethod, formData }) => {
      return new Promise((resolve, reject) => {
        fetch("/process_payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
          .then((response) => response.json())
          .then((response) => resolve(response))
          .catch((error) => reject());
      });
    },
    onError: (error) => console.error(error),
    onClickEditShippingData: () => {},
    onClickEditBillingData: () => {},
    onRenderNextStep: (currentStep) => {},
    onRenderPreviousStep: (currentStep) => {},
  },
};
```

---

## Detalles de Configuración

### **1. Activación de Funcionalidad (Obligatorio)**

La propiedad `enableReviewStep` es **indispensable** para habilitar esta funcionalidad.

---

### **2. Ítems (Obligatorio)**

Define los elementos del pedido:

```javascript
const settings = {
  initialization: {
    items: {
      totalItemsAmount: 9.42,
      itemsList: [
        { units: 3, value: 3.14, name: "<NAME>", description: "<DESCRIPTION>", imageURL: "<IMAGE_URL>" },
      ],
    },
  },
};
```

---

### **3. Payer (Opcional)**

Identificación del comprador. Recomendamos completarlo:

```javascript
const settings = {
  initialization: {
    payer: { email: "<EMAIL>" },
  },
};
```

---

### **4. Shipping (Opcional)**

Información relacionada con la dirección de entrega:

```javascript
const settings = {
  initialization: {
    shipping: {
      costs: 5,
      shippingMode: "<SHIPPING_MODE>",
      description: "<SHIPPING_DESCRIPTION>",
      receiverAddress: {
        streetName: "<STREET_NAME>",
        streetNumber: "<STREET_NUMBER>",
        zipCode: "<ZIP_CODE>",
      },
    },
  },
};
```

---

### **5. Billing (Opcional)**

Datos fiscales del pedido:

```javascript
const settings = {
  initialization: {
    billing: {
      firstName: "<FIRST_NAME>",
      taxIdentificationNumber: "<TAX_IDENTIFICATION_NUMBER>",
      billingAddress: {
        streetName: "<STREET_NAME>",
        streetNumber: "<STREET_NUMBER>",
        zipCode: "<ZIP_CODE>",
      },
    },
  },
};
```

---

### **6. Discounts (Opcional)**

Define los descuentos aplicados al pedido:

```javascript
const settings = {
  initialization: {
    discounts: {
      totalDiscountsAmount: 3,
      discountsList: [{ name: "<DISCOUNT_NAME>", value: 3 }],
    },
  },
};
```

> **Nota:** Los descuentos son solo representaciones visuales y no se restan automáticamente del monto total del pago.

---

## Personalización y Callbacks

### **Orden de los Cuadros de Información**

Usa `reviewCardsOrder` para personalizar el orden:

```javascript
const settings = {
  customization: {
    reviewCardsOrder: ["shipping", "payment_method", "billing"],
  },
};
```

### **Callbacks de Edición**

- **`onClickEditShippingData`**: Editar datos de envío.
- **`onClickEditBillingData`**: Editar datos de facturación.

```javascript
window.paymentBrickController = await bricksBuilder.create("payment", "paymentBrick_container", settings);

window.paymentBrickController.update((paymentData) => { ... });
```

---

## Proceso de Pago

Al hacer clic en "Pagar", se activa la callback `onSubmit`, que envía los datos al backend:

```javascript
onSubmit: ({ selectedPaymentMethod, formData }) => {
  return new Promise((resolve, reject) => {
    fetch("/process_payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => reject());
  });
};
```

---

## Personalización de Textos

Envía el objeto `customization.visual.texts` para modificar los textos predeterminados del Brick.

---


# Preferencia en el Envío

Puedes crear la preferencia al momento de hacer clic en el botón, es decir, al enviar el formulario. Esto es útil en casos como el de **one-click**, utilizando el botón directamente en la página del producto.

## Ejemplo

```javascript
const renderWalletBrick = async (bricksBuilder) => {
  const settings = {
    callbacks: {
      onSubmit: (formData) => {
        // callback llamado al hacer clic en Wallet Brick
        const yourRequestBodyHere = {
          items: [
            {
              id: '202809963',
              title: 'Dummy title',
              description: 'Dummy description',
              quantity: 1,
              unit_price: 10,
            },
          ],
          purpose: 'wallet_purchase',
        };
        return new Promise((resolve, reject) => {
          fetch('/create_preference', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })
            .then((response) => response.json())
            .then((response) => {
              resolve(response.preference_id);
            })
            .catch(() => reject());
        });
      },
    },
  };
  window.walletBrickController = await bricksBuilder.create(
    'wallet',
    'walletBrick_container',
    settings,
  );
};
renderWalletBrick(bricksBuilder);
```

En este caso, **no es necesario** pasar la preferencia en el inicio.

---

## Modo de Apertura

El esquema de apertura te permite definir cómo se abrirá la caja para el usuario:

- **Por defecto:** Se abre con redirección dentro de la misma página (`redirect`).
- **Personalizado:** Se puede configurar para que se abra en una nueva página.

### Propiedad `redirectMode`

| **Valor** | **Descripción**                                  |
|-----------|--------------------------------------------------|
| `self`    | Mantiene la redirección en la misma página.       |
| `blank`   | Externaliza la redirección a una nueva página.    |

### Ejemplo

```javascript
const renderComponent = async (bricksBuilder) => {
  const settings = {
    initialization: {
      preferenceId: '<PREFERENCE_ID>',
      redirectMode: 'blank'
    }
  };
  const brickController = await bricksBuilder.create(
    'wallet',
    'wallet_container',
    settings
  );
};
renderComponent(bricksBuilder);
```

> **Atención:** Configura las `back_urls` correctamente al crear la preferencia, ya que serán responsables del flujo de retorno al sitio web.

---

## Callbacks Adicionales

Al inicializar el Brick, puedes configurar **callbacks adicionales** que proporcionan más información.

| **Callback** | **Descripción**                                                                 |
|--------------|---------------------------------------------------------------------------------|
| `onError`    | Activado cuando ocurre un error en el Brick.                                    |
| `onReady`    | Activado cuando el Brick está listo para recibir interacciones del usuario.     |
| `onSubmit`   | Activado cuando el usuario hace clic en el botón.                               |

### Ejemplo

```javascript
const settings = {
  callbacks: {
    onError: (error) => {
      console.log(error); // Maneja errores
    },
    onReady: () => {
      console.log('Brick está listo'); // Activado cuando el Brick está listo
    },
    onSubmit: () => {
      console.log('Botón clicado'); // Activado al hacer clic
    },
  },
};
```

---

# Card Payment Brick

### Ejemplo de Implementación

```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });
const payment = new Payment(client);

payment.create({ body: req.body })
  .then(console.log)
  .catch(console.log);
```

---

## Enviar el Pago a Mercado Pago

### **Server-Side**

Tu backend debe disponer de un endpoint `/process_payment` para recibir los datos generados tras el envío del formulario.

- **Campos mínimos requeridos:**
  - `token`
  - `transaction_amount`
  - `installments`
  - `payment_method_id`
  - `payer.email`

> **Nota:** Consulta la documentación técnica para obtener especificaciones detalladas.

### Ejemplo de Solicitud

```javascript
const mercadopago = require('mercadopago');
import { MercadoPagoConfig, Payment } from '@src/index';

const client = new MercadoPagoConfig({ accessToken: '<ACCESS_TOKEN>', options: { timeout: 5000 } });
const payment = new Payment(client);

payment
  .create({
    body: {
      transaction_amount: 100,
      token: '<TOKEN>',
      description: '<DESCRIPTION>',
      installments: 1,
      payment_method_id: '<PAYMENT_METHOD_ID>',
      issuer_id: 310,
      payer: {
        email: '<EMAIL>',
        identification: {
          number: '12345678909',
          type: 'CPF',
        },
      },
    },
  })
  .then(console.log)
  .catch(console.log);
```

### Respuesta

```json
{
  "status": "approved",
  "status_detail": "accredited",
  "id": 3055677,
  "date_approved": "2019-02-23T00:01:10.000-04:00",
  "payer": { ... },
  "payment_method_id": "visa",
  "payment_type_id": "credit_card",
  "refunds": [],
  ...
}
```

---

## Importante

- **Validación previa:** Valida que los datos sean correctos antes de enviarlos a la API.
- **Uso de `X-Idempotency-Key`:** Envía este atributo para evitar acciones duplicadas.

### Ejemplo

```javascript
let amount = 95;
cardPaymentBrickController.update({ amount });
```

> **Nota:** Recomendamos adherirse al protocolo 3DS 2.0 para aumentar la probabilidad de aprobación de los pagos.

---


# Configurar Cuotas

### **Client-Side**

| **Propiedad**                      | **Tipo**  | **Observaciones**                                                                                     |
|------------------------------------|-----------|-------------------------------------------------------------------------------------------------------|
| `customization.paymentMethods.minInstallments` | `number` | Define el número mínimo de cuotas.                                                                    |
| `customization.paymentMethods.maxInstallments` | `number` | Define el número máximo de cuotas.                                                                    |

### Ejemplo de Configuración

```javascript
const settings = {
  ...,
  customization: {
    paymentMethods: {
      minInstallments: number,
      maxInstallments: number,
    },
  },
};
```

---

# Configurar Medios de Pago Aceptados

A través de **Checkout Bricks**, puedes definir qué medios de pago (débito o crédito) estarán habilitados. Por defecto, ambos están habilitados, pero es posible limitar la selección.

### Detalles de Personalización

| **Propiedad**             | **Tipo**    | **Notas**                                                                                  |
|---------------------------|-------------|-------------------------------------------------------------------------------------------|
| `customization.paymentMethods.types.excluded` | `string[]` | Valores aceptados: `credit_card`, `debit_card`.                                            |

### Ejemplo

```javascript
const settings = {
  ...,
  customization: {
    paymentMethods: {
      types: {
        excluded: ['debit_card'], // Solo permite tarjetas de crédito
      },
    },
  },
};
```

---

# Datos Adicionales

Dentro del callback `onSubmit`, hay un segundo parámetro opcional llamado `additionalData`, que contiene datos útiles pero no obligatorios para el backend.

### Campos de `additionalData`

| **Campo**          | **Tipo**   | **Descripción**                                       |
|--------------------|------------|-------------------------------------------------------|
| `bin`             | `string`   | BIN de la tarjeta ingresada por el usuario.           |
| `lastFourDigits`  | `string`   | Últimos cuatro dígitos de la tarjeta.                 |
| `cardholderName`  | `string`   | Nombre del titular de la tarjeta.                     |

### Ejemplo

```javascript
const settings = {
  ...,
  callbacks: {
    onSubmit: (cardFormData, additionalData) => {
      console.log(additionalData); // Imprime los datos adicionales

      return new Promise((resolve, reject) => {
        fetch("/process_payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardFormData),
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
      });
    },
  },
};
```

#### Acceso Alternativo a `additionalData`

```javascript
cardPaymentBrickController.getAdditionalData()
  .then((additionalData) => {
    console.log("Additional data:", additionalData);
  })
  .catch((error) => console.error(error));
```

> **Atención:** Llama al método `getAdditionalData` solo después de haber enviado el formulario con `getFormData`.

---

# Callbacks Adicionales

### **onBinChange**

Se activa cada vez que el usuario actualiza el BIN de la tarjeta en el Brick.

```javascript
const settings = {
  ...,
  callbacks: {
    onBinChange: (bin) => {
      console.log(bin); // Imprime el BIN actualizado
    },
  },
};
```

> **Nota:** Solo considera el BIN como válido después de que el evento de envío sea activado por el callback `onSubmit`.

---

# Status Screen Brick

### Configurar URL de Redireccionamiento

El **Status Screen Brick** permite redirigir al usuario a otra página de tu sitio mediante los botones de redirección.

### Ejemplo

```javascript
const settings = {
  initialization: {
    paymentId: 100, // ID de pago generado por Mercado Pago
  },
  callbacks: {
    onReady: () => {
      console.log("Brick está listo");
    },
    onError: (error) => {
      console.error(error); // Manejo de errores
    },
  },
  customization: {
    backUrls: {
      error: "http://<tu_dominio>/error",  // URL para errores de pago
      return: "http://<tu_dominio>/homepage", // URL para redirección exitosa
    },
  },
};
```

> **Atención:** Las URLs deben pertenecer al mismo dominio donde está cargado el Brick. No se aceptan subdominios diferentes.

### Personalización de Textos

Puedes personalizar los textos de los botones de redirección:

| **Clave**              | **Descripción**                                     |
|------------------------|-----------------------------------------------------|
| `ctaGeneralErrorLabel` | Texto para errores generales de pago.               |
| `ctaCardErrorLabel`    | Texto para errores en los datos de la tarjeta.      |
| `ctaReturnLabel`       | Texto para redirección en todos los estados.        |

---