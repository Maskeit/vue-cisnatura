import { defineStore } from "pinia";
import { UserAccountService } from "@/services/UserAccountService";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    name: null,
    email: null,
    phone: null,
    loggedIn: false, // Estado de sesión
    orders: [], // Historial de órdenes
    address: [],
  }),
  actions: {
    async fetchUserInfo() {
      if (this.name) return; // Evita hacer la petición si los datos ya están cargados
      try {
        const userData = await UserAccountService.getUserInfo();
        if (userData) {
          this.name = userData.name;
          this.email = userData.email;
          this.phone = userData.phone;
          this.loggedIn = true; // Marca al usuario como logueado
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        this.loggedIn = false;
      }
    },
    setUserFromCache(cachedName) {
      this.name = cachedName;
      this.loggedIn = true;
    },
    clearUser() {
      this.name = null;
      this.email = null;
      this.phone = null;
      this.loggedIn = false;
    },
    async getHistory() {
      if (this.orders && this.orders.length > 0) return; // Evita peticiones repetidas
      try {
        const response = await UserAccountService.getOrdersHistory();
        // Si response.data ya es un array, solo asignarlo directamente
        if (Array.isArray(response)) {
          this.orders = response;
        } else {
          console.error(
            "Formato inesperado en la respuesta de órdenes:",
            response.data
          );
          this.orders = []; // Establece un valor seguro en caso de error
        }
      } catch (error) {
        console.error("Error al obtener el historial de órdenes:", error);
        this.orders = []; // Maneja el estado en caso de fallo
      }
    },
    async getAddress() {
      if (this.address.length > 0) return;

      const cachedAddresses = localStorage.getItem("userAddresses");
      if (cachedAddresses) {
        // Usa el método Vue `splice` para actualizar reactivamente el array
        const cachedData = JSON.parse(cachedAddresses);
        this.address.splice(0, this.address.length, ...cachedData);
        return;
      }

      try {
        const response = await UserAccountService.getAllAddress();
        if (Array.isArray(response)) {
          this.address.splice(0, this.address.length, ...response); // Reactivamente actualiza el array
          localStorage.setItem("userAddresses", JSON.stringify(response));
        } else {
          console.error(
            "Formato inesperado en la respuesta de direcciones:",
            response
          );
          this.address = [];
        }
      } catch (error) {
        console.error("Error al obtener las direcciones:", error);
        this.address = [];
      }
    },
  },
});
