import { defineStore } from "pinia";
import Operations from "@/services/AdminServices/Operations"; // Usa tu servicio con Axios

export const useOrderStore = defineStore("orderStore", {
  // Estado inicial
  state: () => ({
    orders: [], // Lista de órdenes
    selectedOrder: null, // Orden seleccionada para los detalles
    currentPage: 1, // Página actual
    itemsPerPage: 6, // Límite por página

    users: [], // Lista de usuarios
  }),

  // falta agregar un store para pedir una sola orden pasando el id
  actions: {
    async fetchOrders(page = 1, limit = 6) {
      try {
        const orders = await Operations.getOrders(page, limit);
        this.orders = orders; // Actualiza el estado con las órdenes
        this.currentPage = page; // Actualiza la página actual
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
      }
    },
    selectOrder(orderId) {
      this.selectedOrder = this.orders.find((order) => order.id === orderId);
    },
    // Obtener una orden específica desde el backend
    async fetchOrderById(orderId) {
      try {
        const order = await Operations.getOrder(orderId);

        if (order) {
          // Normalizar la estructura del objeto
          const normalizedOrder = {
            id: order.id,
            subtotal: parseFloat(order.subtotal),
            envio: parseFloat(order.envio),
            total: parseFloat(order.total),
            order_status: order.order_status,
            productsData: order.productsData, // Ya es un array decodificado
            address_id: order.address, // Ya es un objeto decodificado
            created_at: order.created_at,
          };

          // Agregar o actualizar la orden en el estado
          const existingOrderIndex = this.orders.findIndex(
            (o) => o.id === orderId
          );
          if (existingOrderIndex !== -1) {
            this.orders[existingOrderIndex] = normalizedOrder;
          } else {
            this.orders.push(normalizedOrder);
          }
        }
      } catch (error) {
        console.error(`Error al obtener la orden con ID ${orderId}:`, error);
      }
    },

    // Obtener una orden específica desde el estado
    getOrderById(orderId) {
      return this.orders.find((order) => order.id === orderId) || null;
    },

    // Obtener la lista de usuarios
    async fetchUsers() {
      try {
        const users = await Operations.getCustomers();
        this.users = users;
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    },
  },

  persist: true, // Habilitamos la persistencia

  // Getters para computar datos derivados del estado
  getters: {
    filteredOrders: (state) => (searchQuery) => {
      if (!searchQuery) return state.orders;
      return state.orders.filter((order) =>
        Object.values(order)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    },
  },
});
