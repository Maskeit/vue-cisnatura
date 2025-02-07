import { User } from "@/interfaces/User";
import { ProductOrder } from "@/interfaces/ProductOrder";
import axiosInstance from "./axiosInstance";
import { system } from "./system";
import { Address } from "@/interfaces/Address";

system.initializeAuth();

export const UserAccountService = {
  /**
   * Guarda una nueva dirección
   */
  async saveAddress(json: Address): Promise<{ success: boolean; message: string } | number> {
    if (!system.http.check.live()) return { success: false, message: "El sistema no está disponible" };
    try {
      if (!json.fullName || !json.calle || !json.colonia || !json.postalcode || !json.telefono || !json.estado || !json.ciudad) {
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
  /**
   * Obtiene todas las direcciones del usuario
   */
  async getAllAddress(): Promise<Address[] | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.get<{ data: Address[] }>("/address/uid/get");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
      return null;
    }
  },

  /**
   * Elimina una dirección por ID
   */
  async deleteAddress(id: string): Promise<number | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.post("/address/delete", { data: id });
      return response.data.status;
    } catch (error) {
      console.error("Error al eliminar la dirección:", error);
      return null;
    }
  },

  /**
   * Asigna una dirección a un pedido
   */
  async sendAddressToOrder(id: string): Promise<number | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.put("/order/update/address", { data: id });
      return response.data.status;
    } catch (error) {
      console.error("Error al enviar la dirección al pedido:", error);
      return null;
    }
  },
  /**
   * Obtiene la información del usuario
   */
  async getUserInfo(): Promise<{ name: string; email: string; telefono: string } | null> {
    if (!system.http.check.auth()) return null;
    try {
      const response = await axiosInstance.get<{ data: [{ name: string; email: string; telefono: string }] }>("/user/data/get");
      return response.data.data[0];
    } catch (error) {
      console.error("Error obteniendo la información del usuario:", error);
      return null;
    }
  },
  
  async updateUserInfo(updatedData: Partial<User>): Promise<{ success: boolean; message: string } | number> {
    if (!system.http.check.live()) return { success: false, message: "El sistema no está disponible" };
    try {
      // Validar que al menos un campo se esté enviando
      if (!updatedData.name && !updatedData.telefono) {
        return { success: false, message: "Debes proporcionar al menos un campo para actualizar." };
      }

      // Enviar solo los valores no vacíos
      const response = await axiosInstance.put("/user/data/update", updatedData);
      return response.data.status;
    } catch (error) {
      console.error("Error al actualizar la información del usuario:", error);
      return { success: false, message: "Error al actualizar los datos." };
    }
  },

  async getOrder(): Promise<ProductOrder | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.get<{ data: ProductOrder }>("/order/get");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return null;
    }
  },

  async getOrdersHistory(): Promise<ProductOrder[] | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.get<{ data: ProductOrder[] }>("/order/history/get");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener el historial de pedidos:", error);
      return null;
    }
  },

};

export default UserAccountService;
