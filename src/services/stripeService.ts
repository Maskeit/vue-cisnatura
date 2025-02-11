import axiosInstance from "./axiosInstance";

export async function createCheckoutSession() {
  const response = await axiosInstance.post("/stripe/create-checkout-session"); // Ajusta la ruta según tu backend
  return response.data; // Asegúrate de que tu backend devuelva el `sessionId`
}