import axiosInstance from "@/services/axiosInstance";
import { system } from "@/services/system";
import type { ProductOrder, OrderStatus, ShippingStatus } from "@/interfaces/ProductOrder";
import { User } from "@/interfaces/User";

type DatosActualizacionOrden = {
    id: number;
    status: OrderStatus | ShippingStatus;
    type: boolean; // true para envío, false para orden
};
export class OrderService {
    constructor() {
        system.initializeAuth();
    }
    /**
     * Obtener las ordenes de los clientes
     */
    async getClientOrders(page: number = 1, limit: number = 10): Promise<ProductOrder[]> {
        if (!system.http.check.live()) throw new Error("El sistema no está disponible");
        try {
            const response = await axiosInstance.get<{ data: ProductOrder[] }>(
                `/admin/orders/get?page=${page}&limit=${limit}`
            );
            return response.data.data;

        } catch (e) {
            console.error("Error al obtener las ordenes:", e);
            throw e;
        }
    }
    /**
     * Obtiene una orden específica por ID
     */
    async getOrder(orderId: number): Promise<ProductOrder | null> {
        if (!system.http.check.live()) return null;
        try {
            const response = await axiosInstance.get<{ data: ProductOrder }>(`/admin/order/get?orderId=${orderId}`);
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener la orden:", error);
            return null;
        }
    }
    /**
     * Actualiza el estado de una orden dependiendo si es la orden o el envio
     */
    async updateOrder(
        id: number,
        status: OrderStatus | ShippingStatus,
        type: boolean
    ): Promise<boolean> {
        if (!system.http.check.live()) return false;
    
        try {
            const data: DatosActualizacionOrden = { id, status, type };
            
            const response = await axiosInstance.put<{ status: number }>(
                "/admin/orders/update",
                { data: data }
            );
    
            return response.data.status === 200;
        } catch (error) {
            console.error("Error al actualizar el estado:", error);
            return false;
        }
    }

    async sendTracking(email: string, pdf:any): Promise<boolean> {
        if (!system.http.check.live()) return false;
        try {
            const response = await axiosInstance.post("/admin/post/guide",{data: {email: email, pdf: pdf}});
            return response.data.status === 200;
        } catch (error: any) {
            console.error("Error al enviar el tracking:", error);
            return false;
        }
    }
    /**
     * Obtiene la lista de clientes registrados
     */
    async getCustomers(): Promise<User[]> {
        if (!system.http.check.live()) return [];
        try {
            const response = await axiosInstance.get<{ data: User[] }>(`/admin/users/get`);
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
            return [];
        }
    }
}