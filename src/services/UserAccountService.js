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
      const response = await axiosInstance.post("/address/delete", {
        data: id,
      });
      return response.data.status;
    } catch (error) {
      console.error("Error al eliminar la dirección:", error);
      return;
    }
  },
  async sendAddressToOrder(id) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.put("/order/update/address", {
        data: id,
      });
      return response.data.status;
    } catch (error) {
      console.error("Error al enviar la dirección al pedido:", error);
      return;
    }
  },
  async getOrder() {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get("/order/get");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return;
    }
  },
  async getUserInfo() {
    if (!system.http.check.auth()) return;
    try {
      const response = await axiosInstance.get("/user/data/get");
      const userData = response.data.data[0];
      // Asegurarse de que se guarda con la clave correcta
      return {
        name: userData.name,
        email: userData.email,
        telefono: userData.telefono,
      };
    } catch (error) {
      console.error("Error obteniendo la información del usuario:", error);
      throw error;
    }
  },
  async updateUserInfo(updatedData) {
    if (!system.http.check.live()) return;
    try {
      // Validar que al menos un campo se esté enviando
      if (!updatedData.name && !updatedData.telefono) {
        return { success: false, message: "Debes proporcionar al menos un campo para actualizar."};
      }
      // Enviar solo los valores no vacíos
      const response = await axiosInstance.put("/user/data/update",updatedData);
      return response.data.status;
    } catch (error) {
      console.error("Error al actualizar la información del usuario:", error);
      return { success: false, message: "Error al actualizar los datos." };
    }
  },
  async getOrdersHistory() {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get("/order/history/get");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener el historial de pedidos:", error);
      return;
    }
  },
};

export default UserAccountService;
