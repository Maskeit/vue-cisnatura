import { defineStore } from "pinia";
import { AuthService } from "@/services/AdminServices/AuthService";
import type { User } from "@/interfaces/User";
import type { Address } from "@/interfaces/Address";
import type { ProductOrder } from "@/interfaces/ProductOrder";

interface AdminUserState {
  user: User | null;
  loggedIn: boolean;
  orders: ProductOrder[];
  address: Address[];
}

export const useUserAdminStore = defineStore("userAdminStore", {
  state: (): AdminUserState => ({
    user: null,
    loggedIn: false,
    orders: [],
    address: [],
  }),

  actions: {
    async fetchUserInfo(): Promise<void> {
      try {
        // Verificar si los datos del usuario ya están en localStorage
        const cachedUser = localStorage.getItem("adminUserData");
        if (cachedUser) {
          const userData: User = JSON.parse(cachedUser);
          this.user = userData;
          this.loggedIn = true;
          return;
        }

        // Si no hay datos en localStorage, obtener de la API
        const userData: User = await AuthService.getUserInfo();

        if (userData) {
          this.user = userData;
          this.loggedIn = true;

          // Guardar en localStorage para futuras cargas
          localStorage.setItem("adminUserData", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error al obtener los datos del administrador:", error);
        this.loggedIn = false;
      }
    },

    setUserFromCache(cachedName: string): void {
      if (this.user) {
        this.user.name = cachedName;
        this.loggedIn = true;
      }
    },

    clearUser(): void {
      this.user = null;
      this.loggedIn = false;
      localStorage.removeItem("adminUserData");
      localStorage.removeItem("adminUserAddresses");
    }
  },
});