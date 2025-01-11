import axiosInstance from "./axiosInstance";
import { system } from "./system";
system.initializeAuth();
export const UserAccountService = {
  saveAddress: async function (json) {
    if (!system.http.check.live()) return;
    try {
      // Validar los datos antes de enviarlos al servidor
      if (
        !json.name ||
        !json.street ||
        !json.colony ||
        !json.postalCode ||
        !json.phone ||
        !json.state ||
        !json.city
      ) {
        console.error("Faltan campos obligatorios");
        return { success: false, message: "Faltan campos obligatorios" };
      }

      const response = await axiosInstance.post("/address/add", { data: json });
      return response.data.status;
    } catch (error) {
      console.error("Error al guardar la dirección:", error);
      return { success: false, message: "Error al guardar la dirección" };
    }
  },
  async getAllAddress() {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get("/address/uid/get");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
      return;
    }
  },

  async deleteAddress(id) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.post("/address/delete", {data: id});
      return response.data.status;
    } catch (error) {
      console.error("Error al eliminar la dirección:", error);
      return;
    }
  },

  async sendAddressToOrder(id) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.put("/order/update/address", {data: id});
      return response.data.status;
    } catch (error) {
      console.error("Error al enviar la dirección al pedido:", error);
      return;
    }
  },
  async getOrder(){
    if (!system.http.check.live()) return;
    try{
      const response = await axiosInstance.get("/order/get");
      return response.data.data;
    } catch (error){
      console.error("Error al obtener los pedidos:", error);
      return;
    }
  }
};