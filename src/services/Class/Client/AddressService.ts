import type { Address } from "@/interfaces/Address";
import axiosInstance from "@/services/axiosInstance";
import { system } from "@/services/system";

export class AddressService {

    constructor() {
        system.initializeAuth();
    }

    /**
     * Guarda una nueva dirección
     * @param address Datos de la dirección a guardar
     * @returns Estado de éxito o error
     */
    async saveAddress(address: Omit<Address, "id" | "userId">): Promise<number | null> {
        if (!system.http.check.live()) return null;

        try {
            if (!address.fullName || !address.calle || !address.colonia || !address.postalcode || !address.telefono || !address.estado || !address.ciudad) {
                console.error("Faltan campos obligatorios");
                return null;
            }            
            const response = await axiosInstance.post<{ status: number; message: string; data: null }>("/address/add", { data: address });
            if (response.data && typeof response.data.status === "number") {
                return response.data.status;
            } else {
                console.error("La API no devolvió un estado válido:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error al guardar la dirección:", error);
            return null;
        }
    }

    /**
     * Obtiene todas las direcciones del usuario
     * @returns Lista de direcciones o null en caso de error
     */
    async getAllAddresses(): Promise<Address[] | null> {
        if (!system.http.check.live()) return null;

        try {
            const response = await axiosInstance.get<{ data: Address[] }>("/address/uid/get");
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
            return null;
        }
    }

    /**
     * Elimina una dirección por ID
     * @param id ID de la dirección a eliminar
     * @returns Estado de la operación
     */
    async deleteAddress(id: number): Promise<number | null> {
        if (!system.http.check.live()) return null;
        try {
            const response = await axiosInstance.post("/address/delete", { data: id });
            return response.data.status;
        } catch (error) {
            console.error("Error al eliminar la dirección:", error);
            return null;
        }
    }
    /**
     * Asigna una dirección a un pedido
     */
    async sendAddressToOrder(id: number): Promise<number | null> {
        if (!system.http.check.live()) return null;
        try {
            const response = await axiosInstance.put("/order/update/address", { data: id });
            return response.data.status;
        } catch (error) {
            console.error("Error al enviar la dirección al pedido:", error);
            return null;
        }
    }

    /**
     * Obtiene direcciones desde localStorage
     * @returns Lista de direcciones almacenadas
     */
    getAddressesFromStorage(): Address[] {
        const storedData = localStorage.getItem("userAddresses");
        return storedData ? JSON.parse(storedData) : [];
    }

    /**
     * Guarda direcciones en localStorage
     * @param addresses Lista de direcciones
     */
    saveAddressesToStorage(addresses: Address[]): void {
        localStorage.setItem("userAddresses", JSON.stringify(addresses));
    }

    /**
     * Actualiza la lista de direcciones almacenadas en localStorage después de agregar/eliminar
     * @param addresses Lista actualizada de direcciones
     */
    updateStoredAddresses(addresses: Address[]): void {
        this.saveAddressesToStorage(addresses);
    }
}