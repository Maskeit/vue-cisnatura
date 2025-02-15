export const translations = {
  order_status: {
    unconfirmed: "Sin confirmar",
    pending: "Pendiente",
    accepted: "Aceptada",
    complete: "Completada",
    canceled: "Cancelada",
    "in process": "En proceso",
  },
  payment_status: {
    paid: "Pagado",
    unpaid: "No pagado",
    null: "Sin información",
  },
  payment_method: {
    card: "Tarjeta",
    oxxo: "OXXO",
    cash: "Efectivo",
  },
  shippment_status: {
    in_process: "En proceso",
    in_transit: "En Tránsito",
    delivered: "Entregado",
    returned: "Devuelto",
  },
};

export const translate = (type, key) => {
  if (translations[type] && translations[type][key]) {
    return translations[type][key];
  }
  return key; // Devuelve el valor original si no se encuentra traducción
};
