import axiosInstance from "../axiosInstance";
import { system } from "../system";


const Operations = {

  async getOrders(page = 1, limit = 6) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get(
        `/admin/orders/get?page=${page}&limit=${limit}`
      );
      return response.data.data; // Aseguramos que devuelva solo los datos
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      return []; // En caso de error, devolvemos una lista vacía para evitar problemas en el componente
    }
  },

  async getOrder(orderId) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get(`/admin/order/get?orderId=${orderId}`);
      return response.data.data; // Aseguramos que devuelva solo los datos
    } catch (error) {
      console.error("Error al obtener la orden:", error);
      return null; // En caso de error, devolvemos null para evitar problemas en el componente
    }
  },

  async updateOrder(orderId, status, type){
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.put(`/admin/orders/update`, {data: {orderId: orderId, status: status, type: type}});
      return response.data.status; // esto retorna ya el codigo 200, 400, 500
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return false;
    }
  },

  async getCustomers(){
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get(`/admin/users/get`);
      return response.data.data; // Aseguramos que devuelva solo los datos
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      return []; // En caso de error, devolvemos una lista vacía para evitar problemas en el componente
    }
  }
};

export default Operations;