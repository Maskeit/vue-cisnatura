import { defineStore } from "pinia";
import { AuthService } from "@/services/AdminServices/AuthService";

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
          this.phone = userData.telefono;
          this.loggedIn = true;
          return;
        }

        // Si no hay datos en localStorage, obtener de la API
        const userData = await AuthService.getUserInfo();

        if (userData) {
          this.name = userData.name;
          this.email = userData.email;
          this.phone = userData.telefono;
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
  },
});
