import { defineStore } from "pinia";
import { AddressService } from "@/services/Class/Client/AddressService";
import type { Address } from "@/interfaces/Address";
// integrado 
const addressService = new AddressService();

export const useAddressStore = defineStore("addressStore", {
  state: () => ({
    addresses: [] as Address[], // Estado para almacenar las direcciones
  }),

  actions: {
    async fetchAddresses() {
      if (this.addresses.length > 0) return; // ✅ Evita solicitudes innecesarias
      const response = await addressService.getAllAddresses();
      if (response) {
        this.addresses = response;
      }
    },

    async addAddress(newAddress: Omit<Address, "id" | "userId">) {
      const status = await addressService.saveAddress(newAddress);
      if (status === 200) {
        await this.fetchAddresses();
      }
    },

    async removeAddress(id: number) {
      const status = await addressService.deleteAddress(id);
      if (status === 200) {
        this.addresses = this.addresses.filter((address) => address.id !== id);
      }
    },
  },
});