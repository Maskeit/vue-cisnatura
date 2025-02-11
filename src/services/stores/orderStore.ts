import { defineStore } from "pinia";
import Operations from "@/services/AdminServices/Operations"; // Usa tu servicio con Axios
import type { User } from "@/interfaces/User";
import type { ProductOrder } from "@/interfaces/ProductOrder";
import type { Address } from "@/interfaces/Address";

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
        const orders: ProductOrder[] = await Operations.getOrders(page, limit);
        this.orders = orders; // Actualiza el estado con las órdenes
        this.currentPage = page; // Actualiza la página actual
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
      }
    },

    selectOrder(orderId: number): ProductOrder | null {
      return (this.selectedOrder = this.orders.find((order) => order.id === orderId) || null);
    },
    // Obtener una orden específica desde el backend
    async fetchOrderById(orderId: number): Promise<void> {
      try {
        const order: ProductOrder | null = await Operations.getOrder(orderId);

        if (order) {
          // Normalizar la estructura del objeto con valores tipados correctamente
          const normalizedOrder: ProductOrder = {
            id: order.id,
            subtotal: parseFloat(order.subtotal.toString()),
            shippingCost: parseFloat(order.shippingCost.toString()),
            total: parseFloat(order.total.toString()),
            order_status: order.order_status,
            products: order.products,
            address: order.address,
            created_at: order.created_at,
            updated_at: order.updated_at,
            payment_intent_id: order.payment_intent_id,
            chsession_id: order.chsession_id,
            userId: order.userId,
            customer_email: order.customer_email,
            payment_status: order.payment_status,
            payment_method: order.payment_method
          };

          // Buscar si la orden ya existe en el estado
          const existingOrderIndex = this.orders.findIndex((o) => o.id === orderId);
          if (existingOrderIndex !== -1) {
            this.orders[existingOrderIndex] = normalizedOrder;
          } else {
            this.orders.push(normalizedOrder);
          }

          // Asignar la orden seleccionada
          this.selectedOrder = normalizedOrder;
        } else {
          console.error(`No se encontró la orden con ID ${orderId}.`);
          this.selectedOrder = null;
        }
      } catch (error) {
        console.error(`Error al obtener la orden con ID ${orderId}:`, error);
        this.selectedOrder = null;
      }
    },

    // Obtener una orden específica desde el estado
    getOrderById(orderId: number): ProductOrder | null {
      return this.orders.find((order) => order.id === orderId) || null;
    },

    // Obtener la lista de usuarios
    async fetchUsers(): Promise<void> {
      try {
        const users: User[] = await Operations.getCustomers();
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
      return (searchQuery: string) => {
        if (!searchQuery) return state.orders;
        return state.orders.filter((order) =>
          Object.values(order)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
    },
  }

});
