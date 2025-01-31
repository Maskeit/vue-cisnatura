import axiosInstance from "../axiosInstance";
import { system } from "../system";
//use admin
export const AuthService = {
  async login(email, password) {
    try {
      const response = await axiosInstance.post("sudo/login", {
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

  async logout() {
    try {
      const response = await axiosInstance.post("admin/session/close");

      if (response.status === 200) {
        return true;
      }

      if (response.status === 401) {
        console.warn(
          "No había una sesión activa, pero se limpiarán los datos."
        );
        return true;
      }
      console.error("Error inesperado al cerrar sesión:", response.status);
      return false;
    } catch (error) {
      console.error("Error en la solicitud de logout:", error);
      return false;
    } finally {
      // Limpieza obligatoria de la sesión, independientemente del resultado
      localStorage.clear(); // Eliminar datos del usuario
      system.authToken = null; // Remover referencia en el sistema
    }
  },
  
  async getUserInfo() {
    //if (!system.http.check.live()) return;
    try {
      // Verificar si ya existe en localStorage el nombre del usuario
      const cachedName = localStorage.getItem("username");
      if (cachedName) {
        return { name: cachedName }; // Devuelve el nombre almacenado localmente
      }
      // Hacer la solicitud al servidor si no está en localStorage
      const response = await axiosInstance.get("/admin/username");

      const userName = response.data.data[0].name;
      localStorage.setItem("username", userName); // Almacenar en localStorage
      return { name: userName }; // Devuelve el nombre obtenido del servidor
    } catch (error) {
      console.error("Error obteniendo la información del usuario:", error);
      throw error;
    }
  },
};
