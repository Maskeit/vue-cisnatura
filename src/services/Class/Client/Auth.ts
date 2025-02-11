import axiosInstance from "@/services/axiosInstance";
import { system } from "@/services/system";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    LogoutResponse,
    RecoverPasswordDataRequest,
    RecoverPasswordDataResponse,
    RecoverPasswordRequest,
    RecoverPasswordResponse
} from "@/interfaces/Login";

export class Auth {
    constructor() { }
    /**
     * @param email string
     * @param password string
     */
    async login(credentials: LoginRequest): Promise<{ status: number; token: string | null }> {
        try {
            const response = await axiosInstance.post<LoginResponse>("/login", {
                email: credentials.email,
                passwd: btoa(credentials.password), // Codificación base64 para seguridad básica
            });

            if (response.status === 200 && response.data.data) {
                const authToken = response.data.data.token;
                system.authToken = authToken;

                return { status: 200, token: authToken };
            }

            // Si la API responde con otro código, devolver el status pero sin token
            return { status: response.status, token: null };
        } catch (error: any) {
            console.error("Error en la solicitud de inicio de sesión:", error);

            return {
                status: error.response?.status || 500,
                token: null
            };
        }
    }
    async register(credentials: RegisterRequest): Promise<RegisterResponse> {
        try {
            const response = await axiosInstance.post<RegisterResponse>("/register", {
                name: credentials.name,
                email: credentials.email,
                passwd: btoa(credentials.password), // Codificación base64 de la contraseña
            });

            if (response.data.status === 200) {
                return {
                    status: response.data.status,
                    message: response.data.message
                };
            }
            // return por defecto si la respuesta no es 200
            return {
                status: response.data.status,
                message: response.data.message || "Registro no exitoso",
            };
        } catch (error: any) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Error desconocido",
            };
        }
    }

    // crear aqui logout
    async logout(): Promise<LogoutResponse> {
        try {
            const response = await axiosInstance.post<LogoutResponse>("/client/session/close");

            if (response.status === 200 || response.status === 401) {
                console.warn(response.status === 401 ? "No había sesión activa." : "Sesión cerrada correctamente.");
            }

            // Limpieza de sesión obligatoria
            localStorage.clear();
            system.authToken = null;

            return {
                status: response.status,
                message: response.data.message || "Sesión cerrada correctamente"
            };
        } catch (error: any) {
            console.error("Error en la solicitud de logout:", error);
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Error desconocido",
            };
        }
    }
    async recoverPassword(data: RecoverPasswordRequest): Promise<RecoverPasswordResponse> {
        try {
            const response = await axiosInstance.post<RecoverPasswordResponse>("/recover/password", {
                email: data.email,
            });

            return {
                status: response.data.status,
                message: response.data.message || "Correo de recuperación enviado",
            };
        } catch (error: any) {
            console.error("Error al recuperar contraseña:", error);
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Error al recuperar contraseña",
            };
        }
    }
    async recoverPasswordData(data: RecoverPasswordDataRequest): Promise<RecoverPasswordDataResponse> {
        try {
            const response = await axiosInstance.post<RecoverPasswordDataResponse>("/recover/password/data", {
                email: data.email,
                passwd: btoa(data.password), // Codificación base64 de la contraseña
                token: data.token,
            });

            return {
                success: response.data.success,
                message: response.data.message || "Contraseña restaurada exitosamente",
            };
        } catch (error: any) {
            console.error("Error al recuperar contraseña:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al recuperar contraseña",
            };
        }
    }
}