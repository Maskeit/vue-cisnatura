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
      localStorage.setItem("userData", JSON.stringify(userData));
      return {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      };
    } catch (error) {
      console.error("Error obteniendo la información del usuario:", error);
      throw error;
    }
  },
  async updateUserInfo(json) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.put("/user/data/update", {
        data: json,
      });
      return response.data.status;
    } catch (error) {
      console.error("Error al actualizar la información del usuario:", error);
      return;
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
