import axiosInstance from "../axiosInstance";
import { system } from "../system";
import { User } from "@/interfaces/User";

// Interfaz para la respuesta de autenticación del admin
interface AdminAuthResponse {
  status: number;
  token?: string;
  message?: string;
}

// Definir el servicio de autenticación para administradores
export const AuthService = {
  /**
   * Iniciar sesión como administrador
   */
  async login(email: string, password: string): Promise<AdminAuthResponse> {
    try {
      const response = await axiosInstance.post<{ data: { token: string } }>("sudo/login", {
        email,
        passwd: btoa(password), // Codificación base64 de la contraseña
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
      console.error("Error en login:", error);

      if (!error.response || error.response.status === 500) {
        throw new Error("Error del servidor o de red.");
      }

      return {
        status: error.response.status,
        message: error.response.data.message || "Error desconocido",
      };
    }
  },

  /**
   * Cerrar sesión del administrador
   */
  async logout(): Promise<boolean> {
    try {
      const response = await axiosInstance.post("admin/session/close");

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
      // Limpieza de sesión
      localStorage.clear();
      system.authToken = null;
    }
  },

  /**
   * Obtener información del usuario administrador
   */
  async getUserInfo(): Promise<Partial<User> | null> {
    try {
      // Verificar si ya existe en localStorage el nombre del usuario
      const cachedName = localStorage.getItem("username");
      if (cachedName) {
        return { name: cachedName };
      }

      // Hacer la solicitud al servidor si no está en localStorage
      const response = await axiosInstance.get<{ data: [{ name: string }] }>("/admin/username");

      const userName = response.data.data[0].name;
      localStorage.setItem("username", userName);
      return { name: userName };
    } catch (error) {
      console.error("Error obteniendo la información del usuario:", error);
      return null;
    }
  },
};

export default AuthService;