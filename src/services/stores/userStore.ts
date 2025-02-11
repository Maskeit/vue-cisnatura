import { defineStore } from "pinia";
import { UserAccountService } from "@/services/UserAccountService";
import { UserData } from "@/services/Class/Client/UserData";
import type { User } from "@/interfaces/User";
import type { Address } from "@/interfaces/Address";
import type { ProductOrder } from "@/interfaces/ProductOrder";

interface UserState {
  user: User | null;
  loggedIn: boolean;
  orders: ProductOrder[];
  address: Address[];
}

export const useUserStore = defineStore("userStore", {
  state: (): UserState => ({
    user: null,
    loggedIn: false,
    orders: [],
    address: [],
  }),

  actions: {
    async fetchUserInfo(): Promise<void> {
      // Evita múltiples llamadas si ya hay datos en el estado
      if (this.user) return;

      // Verificar si hay datos en localStorage
      const cachedUser = localStorage.getItem("userData");

      if (cachedUser) {
        this.user = JSON.parse(cachedUser);
        this.loggedIn = true;
      } else {
        try {
          const userService = new UserData();
          const response = await userService.getUserData();

          if (response.status === 200 && response.data.length > 0) {
            this.user = response.data[0]; // Guardar usuario en el estado
            this.loggedIn = true;
            localStorage.setItem("userData", JSON.stringify(response.data[0])); // Guardar en localStorage
          } else {
            console.warn("No se encontraron datos de usuario.");
            this.user = null;
            this.loggedIn = false;
          }
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
          this.user = null;
          this.loggedIn = false;
        }
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
      localStorage.removeItem("userData");
      localStorage.removeItem("userAddresses");
    },

    async getHistory(): Promise<void> {
      if (this.orders.length > 0) return; // Evita peticiones repetidas
      try {
        const response: ProductOrder[] = await UserAccountService.getOrdersHistory();
        if (Array.isArray(response)) {
          this.orders = response;
        } else {
          console.error("Formato inesperado en la respuesta de órdenes:", response);
          this.orders = [];
        }
      } catch (error) {
        console.error("Error al obtener el historial de órdenes:", error);
        this.orders = [];
      }
    },
    async getAddress(): Promise<void> {
      if (this.address.length > 0) return; // Evita peticiones repetidas

      const cachedAddresses = localStorage.getItem("userAddresses");

      if (!cachedAddresses || cachedAddresses === "[]") {
        try {
          const response: Address[] = await UserAccountService.getAllAddress();
          if (Array.isArray(response) && response.length > 0) {
            this.address = [...response]; // Reactivamente actualiza el array
            localStorage.setItem("userAddresses", JSON.stringify(response));
          } else {
            console.log("No se encontraron direcciones en la API.");
            this.address = [];
          }
        } catch (error) {
          console.error("Error al obtener las direcciones:", error);
          this.address = [];
        }
      } else {
        this.address = JSON.parse(cachedAddresses);
      }
    },

    setAddress(newAddresses: Address[]): void {
      console.log("setAddress", newAddresses);
      this.address = [...newAddresses];
      localStorage.setItem("userAddresses", JSON.stringify(newAddresses));
    },

    async addAddress(newAddress: Omit<Address, "id" | "userId">): Promise<boolean> {
      try {
        const savedAddress = await addressService.saveAddress(newAddress);

        if (savedAddress) {
          this.address = [...this.address, savedAddress]; // Agregar la nueva dirección al estado
          localStorage.setItem("userAddresses", JSON.stringify(this.address)); // Guardar en localStorage
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error al agregar la dirección:", error);
        return false;
      }
    },
    async deleteAddress(id: string): Promise<boolean> {
      if (!id) return false;
      try {
        const response = await UserAccountService.deleteAddress(id);
        if (response === 200) {
          this.address = this.address.filter((address) => address.id !== id);
          localStorage.setItem("userAddresses", JSON.stringify(this.address));
          return true;
        } else {
          console.error("No se pudo eliminar la dirección, respuesta inesperada:", response);
          return false;
        }
      } catch (error) {
        console.error("Error al eliminar la dirección:", error);
        return false;
      }
    },
  },
});
