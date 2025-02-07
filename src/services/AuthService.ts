import axiosInstance from "./axiosInstance";
import { system } from "./system";
import { User } from "@/interfaces/User";

// Interfaz para la respuesta de autenticación
interface AuthResponse {
  status: number;
  token?: string;
  message?: string;
}

export const AuthService = {
  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<{ data: { token: string } }>("/login", {
        email,
        passwd: btoa(password), // Codificar password en base64
      });

      if (response.status === 200) {
        const authToken = response.data.data.token;
        system.authToken = authToken;
        return { status: 200, token: authToken };
      }

      return {
        status: response.status,
        message: response.data.message || "Error desconocido",
      };
    } catch (error: any) {
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error desconocido",
      };
    }
  },

  /**
   * Registro de usuario
   */
  async register(userData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post("/register", {
        name: userData.name,
        email: userData.email,
        passwd: userData.password ? btoa(userData.password) : "",
      });

      return {
        status: response.status,
        message: response.data.message || "Registro exitoso",
      };
    } catch (error: any) {
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error desconocido",
      };
    }
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<boolean> {
    try {
      const response = await axiosInstance.post("/client/session/close");

      if (response.status === 200 || response.status === 401) {
        console.warn(response.status === 401 ? "No había sesión activa." : "Sesión cerrada correctamente.");
        return true;
      }

      console.error("Error inesperado al cerrar sesión:", response.status);
      return false;
    } catch (error) {
      console.error("Error en la solicitud de logout:", error);
      return false;
    } finally {
      // Limpieza de sesión obligatoria
      localStorage.clear();
      system.authToken = null;
    }
  },

  /**
   * Restablecer contraseña
   */
  async resetPassword(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ data: { success: boolean; message: string } }>("/reset/password");
      return response.data;
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      return { success: false, message: "Error al restablecer contraseña" };
    }
  },

  /**
   * Recuperar contraseña (envío de correo)
   */
  async recoverPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ data: { success: boolean; message: string } }>("/recover/password", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      return { success: false, message: "Error al recuperar contraseña" };
    }
  },

  /**
   * Restaurar contraseña con token de recuperación
   */
  async recoverPasswordData(email: string, passwd: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ data: { success: boolean; message: string } }>("/recover/password/data", {
        email,
        passwd: btoa(passwd),
        token,
      });
      return response.data;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      return { success: false, message: "Error al recuperar contraseña" };
    }
  },
};

export default AuthService;