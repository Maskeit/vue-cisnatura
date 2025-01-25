import axiosInstance from "./axiosInstance";
import { system, V_Global_API } from "./system";
import Cookes from 'js-cookie';
export const AuthService = {
  async login(email, password) {
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        passwd: btoa(password), // Encriptar la contraseña
      });

      if (response.status === 200 && response.data.data) {
        const authToken = response.data.data; // es el token de la respuesta en data
        system.authToken = authToken.token; // Guardar el token en el sistema
        return authToken.token;
      }
      return null; // No se encontró el usuario o la contraseña es incorrecta
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
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

  async getUserInfo() {
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        return;
      }
      // Verificar si ya existe en localStorage el nombre del usuario
      const cachedName = localStorage.getItem("username");
      if (cachedName) {
        return { name: cachedName }; // Devuelve el nombre almacenado localmente
      }
      // Hacer la solicitud al servidor si no está en localStorage
      const response = await axiosInstance.post(
        "/username",
        {}, // Cuerpo vacío
        {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de que el formato sea correcto
          },
        }
      );

      const userName = response.data.data[0].name;
      localStorage.setItem("username", userName); // Almacenar en localStorage
      return { name: userName }; // Devuelve el nombre obtenido del servidor
    } catch (error) {
      console.error("Error obteniendo la información del usuario:", error);
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
};
