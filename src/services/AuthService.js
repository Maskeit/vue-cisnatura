import axiosInstance from "./axiosInstance";

export const AuthService = {
  async login(email, password) {
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        passwd: btoa(password), // Encriptar la contraseña
      });
      return response.data;
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
};