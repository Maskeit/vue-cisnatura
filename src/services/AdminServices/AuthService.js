import axiosInstance from "../axiosInstance";
import { system } from "../system";
//use admin
export const AuthService = {
  async login(email, password) {
    try {
      const response = await axiosInstance.post("/sudo/login", {
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
  async logout() {
    try {
      const response = await axiosInstance.post("admin/session/close");
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
      // Opcional: Eliminar cookies relacionadas
      system.cookies.remove("SSK");
    }
  },
  async getUserInfo() {
    if (!system.http.check.live()) return;
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
