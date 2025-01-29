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
      try {
        // Verificar si los datos del usuario ya están en localStorage
        const cachedUser = localStorage.getItem("userData");
        if (cachedUser) {
          const userData = JSON.parse(cachedUser);
          this.name = userData.name;
          this.email = userData.email;
          this.phone = userData.phone;
          this.loggedIn = true;
          return;
        }

        // Si no hay datos en localStorage, obtener de la API
        const userData = await UserAccountService.getUserInfo();
        if (userData) {
          this.name = userData.name;
          this.email = userData.email;
          this.phone = userData.phone;
          this.loggedIn = true;

          // Guardar en localStorage para futuras cargas
          localStorage.setItem("userData", JSON.stringify(userData));
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

      // Si no existe la clave en localStorage o está vacía, hace la petición a la API
      if (!cachedAddresses || cachedAddresses === "[]") {
        try {
          const response = await UserAccountService.getAllAddress();
          if (Array.isArray(response) && response.length > 0) {
            this.address.splice(0, this.address.length, ...response); // Reactivamente actualiza el array
            localStorage.setItem("userAddresses", JSON.stringify(response));
          } else {
            console.warn("No se encontraron direcciones en la API.");
            this.address = [];
          }
        } catch (error) {
          console.error("Error al obtener las direcciones:", error);
          this.address = [];
        }
      } else {
        // Usa el método Vue `splice` para actualizar reactivamente el array con datos en localStorage
        const cachedData = JSON.parse(cachedAddresses);
        this.address.splice(0, this.address.length, ...cachedData);
      }
    },
    async deleteAddress(id) {
      if (!id) return false;
      try {
        const response = await UserAccountService.deleteAddress(id);
        if (response === 200) {
          // Filtramos la dirección eliminada del store para actualizar la UI
          this.address = this.address.filter((address) => address.id !== id);
          localStorage.setItem("userAddresses", JSON.stringify(this.address)); // Actualizar el localStorage
          return true;
        } else {
          console.error(
            "No se pudo eliminar la dirección, respuesta inesperada:",
            response
          );
          return false;
        }
      } catch (error) {
        console.error("Error al eliminar la dirección:", error);
        return false;
      }
    },
  },
});
