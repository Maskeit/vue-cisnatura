import axiosInstance from "./axiosInstance";
import { system } from "./system";

export const AuthService = {
  async login(email, password) {
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        passwd: btoa(password),
      });

      // Procesar los códigos de estado
      if (response.status === 200) {
        const authToken = response.data.data.token; // Token de la respuesta
        system.authToken = authToken; // Guardar el token en el sistema
        return { status: 200, token: authToken };
      }

      // Si no es 200, retorna el código y mensaje del backend
      return {
        status: response.status,
        message: response.data.message || "Error desconocido",
      };
    } catch (error) {
      console.error("Error en login:", error);

      // Si es un error del servidor o de red, lo lanzamos
      if (!error.response || error.response.status === 500) {
        throw new Error("Error del servidor o de red.");
      }

      // Si es otro código de estado (400, 401), devolver como respuesta manejable
      return {
        status: error.response.status,
        message: error.response.data.message || "Error desconocido",
      };
    }
  },

  async register(name, email, password) {
    try {
      const response = await axiosInstance.post("/register", {
        name,
        email,
        passwd: btoa(password),
      });
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  async resetPassword(email, password) {
    try {
      const response = await axiosInstance.post("/reset-password", {
        email,
        passwd: btoa(password),
      });
      return response.data;
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await axiosInstance.post("client/session/close");
      if (response.data.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    } finally {
      // Eliminar token y otros datos locales independientemente del resultado
      system.authToken = null;
      localStorage.clear(); // Limpia todo el local storage
    }
  },

  async resetPassword() {
    try {
      const response = await axiosInstance.post("/reset/password");
      return response.data;
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      throw error;
    }
  },

  async recoverPassword(email) {
    try {
      const response = await axiosInstance.post("/recover/password", {email: email});
      return response.data;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      throw error;
    }
  },
  async recoverPasswordData(email, passwd, token) {
    try {
      const response = await axiosInstance.post("/recover/password/data", {email: email, passwd: btoa(passwd), token: token});
      return response.data;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      throw error;
    }
  },
};
