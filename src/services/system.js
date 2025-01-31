export const V_Global_API = "http://cisnaturatienda.local/api/";
export const V_Global_IMG = "http://cisnaturatienda.local/pimg/";
export const V_Domain = "";
import router from "@/router";
import Cookies from "js-cookie";

export const system = {
  authToken: null,
  // Método para inicializar el authToken una vez
  initializeAuth: function () {
    if (!this.authToken) {
      this.authToken = this.http.send.authorization();
    }
    return this.authToken;
  },
  http: {
    send: {
      authorization: () => {
        // enfoque en el que SSID, SSK y APISS__NME están en una cadena como token
        try {
          const token = Cookies.get("Authorization") ? localStorage.getItem("Authorization") : null;
          return token;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    },
    check: {
      live: () => { //redirecciona a pagina de error
        const token = Cookies.get("Authorization");
        if (!token || token === null || token === undefined) {
          system.handlerError.handleError(401, "Página no disponible.");
          return;
        } else{
          return true;
        }
      },
      auth: () => {
        const token = Cookies.get("Authorization");
        if(token){
          return true;
        }
        return false;
      },
    },
  },
  handlerError: {
    handleError: (
      errorCode = 500,
      errorMessage = "Ha ocurrido un error inesperado."
    ) => {
      router.push({
        name: "Error",
        query: { code: errorCode, message: errorMessage },
      });
    },
  },
};

// Este código se ejecuta antes de cada ruta en el router.js
system.initializeAuth();