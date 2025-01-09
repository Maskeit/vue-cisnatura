import axiosInstance from "./axiosInstance";

export const UserAccountService = {
    saveAddress: async function (json) {
        try {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                console.error("Usuario no autenticado");
                return { success: false, message: "Usuario no autenticado" };
            }
    
            // Validar los datos antes de enviarlos al servidor
            if (
                !json.name ||
                !json.street ||
                !json.colony ||
                !json.postalCode ||
                !json.phone ||
                !json.state ||
                !json.city
            ) {
                console.error("Faltan campos obligatorios");
                return { success: false, message: "Faltan campos obligatorios" };
            }
    
            const response = await axiosInstance.post("/address/add", {
                data: json,
            });
            return { success: true, message: "Dirección guardada correctamente" };
        } catch (error) {
            console.error("Error al guardar la dirección:", error);
            return { success: false, message: "Error al guardar la dirección" };
        }
    },
    async getAllAddress(){
        try {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                console.error("Usuario no autenticado");
                return { success: false, message: "Usuario no autenticado" };
            }
            const response = await axiosInstance.get("/address/uid/get");
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
            return { success: false, message: "Error al obtener las direcciones" };
        }
    },
}