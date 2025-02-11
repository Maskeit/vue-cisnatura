import axiosInstance from "@/services/axiosInstance";
import { system } from "@/services/system";
import type { UserResponse, UpdatePhoneReq, UpdatePhoneRes } from "@/interfaces/User";

export class UserData {
    constructor() {
        system.initializeAuth();
    }

    async updatePhoneNumber(phone: UpdatePhoneReq): Promise<UpdatePhoneRes> {
        try {
            const response = await axiosInstance.put("/user/data/update", phone);
            return { status: response.data.status, message: response.data.message }
        } catch (err: any) {
            console.error("Error al actualizar número de teléfono:", err);
            return { status: 500, message: "Error desconocido" };
        }
    }

    async getUserData(): Promise<UserResponse> {
        try {
            const response = await axiosInstance.get<UserResponse>("/user/data/get");
            
            if (response.data.status === 200 && Array.isArray(response.data.data) && response.data.data.length > 0) {
                return {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data.data // Devolver el array de usuarios directamente
                };
            }
    
            return {
                status: 500,
                message: "Error al obtener la información del usuario",
                data: []
            };
    
        } catch (error: any) {            
            console.error("Error al obtener la información del usuario:", error);
            return {
                status: 500,
                message: "Error desconocido",
                data: []
            };
        }
    }
}