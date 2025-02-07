import axiosInstance from "../axiosInstance";
import { system } from "../system";
import { ProductOrder } from "@/interfaces/ProductOrder";
import { User } from "@/interfaces/User";

const Operations = {
  /**
   * Obtiene la lista de órdenes paginadas
   */
  async getOrders(page: number = 1, limit: number = 6): Promise<ProductOrder[]> {
    if (!system.http.check.live()) return [];
    try {
      const response = await axiosInstance.get<{ data: ProductOrder[] }>(
        `/admin/orders/get?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      return [];
    }
  },

  /**
   * Obtiene una orden específica por ID
   */
  async getOrder(orderId: number): Promise<ProductOrder | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.get<{ data: ProductOrder }>(`/admin/order/get?orderId=${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener la orden:", error);
      return null;
    }
  },

  /**
   * Actualiza el estado de una orden
   */
  async updateOrder(orderId: number, status: string, type: string): Promise<boolean> {
    if (!system.http.check.live()) return false;
    try {
      const response = await axiosInstance.put<{ status: number }>(`/admin/orders/update`, {
        data: { orderId, status, type },
      });
      return response.data.status === 200;
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return false;
    }
  },

  /**
   * Obtiene la lista de clientes registrados
   */
  async getCustomers(): Promise<User[]> {
    if (!system.http.check.live()) return [];
    try {
      const response = await axiosInstance.get<{ data: User[] }>(`/admin/users/get`);
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      return [];
    }
  }
};

export default Operations;