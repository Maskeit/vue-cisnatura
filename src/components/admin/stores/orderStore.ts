import { defineStore } from "pinia";
import { OrderService } from "@/services/Class/Admin/OrderService";
import type { User } from "@/interfaces/User";
import type { ProductOrder } from "@/interfaces/ProductOrder";
import type { Address } from "@/interfaces/Address";

const orderInstance = new OrderService();
// este es un store que se usa en el Admin para traer ordenes y hacer operaciones

interface OrderState {
  orders: ProductOrder[]; // lista de todas las ordenes 
  selectedOrder: ProductOrder | null;
  selectedAddress: Address | null; // lista de domicilios
  currentPage: number;
  itemsPerPage: number;
  users: User[]; // Lista de usuarios
}

export const useOrderStore = defineStore("orderStore", {
  // Estado inicial
  state: (): OrderState => ({
    orders: [],
    selectedOrder: null,
    selectedAddress: null,
    currentPage: 1,
    itemsPerPage: 6,
    users: [],
  }),

  // falta agregar un store para pedir una sola orden pasando el id
  actions: {

    async fetchOrders(page: number = 1, limit: number = 6) {
      try {
        const orders: ProductOrder[] = await orderInstance.getClientOrders(page, limit);
        this.orders = orders; // Actualiza el estado con las órdenes
        this.currentPage = page; // Actualiza la página actual
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
      }
    },
    // Obtener una orden específica desde el backend
    async fetchOrderById(orderId: number): Promise<void> {
      try {
        const order: ProductOrder | null = await orderInstance.getOrder(orderId);
        if (order) {
          const existingOrderIndex = this.orders.findIndex((o) => o.id === orderId);
          if (existingOrderIndex !== -1) {
            this.orders[existingOrderIndex] = order;
          } else {
            this.orders.push(order);
          }

          // Asignar la orden seleccionada
          this.selectedOrder = order;
        } else {
          console.error(`No se encontró la orden con ID ${orderId}.`);
          this.selectedOrder = null;
        }
      } catch (error) {
        console.error(`Error al obtener la orden con ID ${orderId}:`, error);
        this.selectedOrder = null;
      }
    },

    selectOrder(orderId: number): ProductOrder | null {
      return (this.selectedOrder = this.orders.find((order) => order.id === orderId) || null);
    },

    // Obtener una orden específica desde el estado
    getOrderById(orderId: number): ProductOrder | null {
      return this.orders.find((order) => order.id === orderId) || null;
    },

    updateOrderState(orderId: number, newData: Partial<ProductOrder>) {
      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        this.orders[orderIndex] = { ...this.orders[orderIndex], ...newData };
      }

      if (this.selectedOrder && this.selectedOrder.id === orderId) {
        this.selectedOrder = { ...this.selectedOrder, ...newData };
      }
    },
    

    // Obtener la lista de usuarios
    async fetchUsers(): Promise<void> {
      try {
        const users: User[] = await orderInstance.getCustomers();
        this.users = users;
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    },
  },

  persist: true, // Habilitamos la persistencia

  // Getters para computar datos derivados del estado
  getters: {
    // Obtener la lista de órdenes paginadas
    filteredOrders: (state: OrderState) => (searchQuery: string) => {
      if (searchQuery == "") return state.orders;
      return state.orders.filter((order) =>
        Object.values(order)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    },
  }

});
