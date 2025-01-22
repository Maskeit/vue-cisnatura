export const V_Global_API = "http://cisnaturatienda.local/api/";
export const V_Global_IMG = "http://cisnaturatienda.local/pimg/";
export const V_Domain = "";
import router from "@/router";
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
      authorizationCookies: () => {
        // enfoque en el que tengo 3 cookies con datos diferentes
        try {
          const SSID = system.cookies.get("SSID");
          const SSK = system.cookies.get("SSK");
          const APISS__NME = system.cookies.get("APISS__NME");

          if (!SSID || !SSK || !APISS__NME) {
            // No se encontró el token de autenticación.
            return null;
          }

          return btoa(JSON.stringify({ SSID, SSK, APISS__NME }));
        } catch (error) {
          console.error("Error obteniendo el token de autenticación:", error);
          return null;
        }
      },
      authorization: () => {
        // enfoque en el que SSID, SSK y APISS__NME están en una cadena como token
        try {
          const token = localStorage.getItem("Authorization");
          return token;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    },
    check: {
      live: () => { //redirecciona a pagina de error
        const token = localStorage.getItem("Authorization");
        if (!token || token === null || token === undefined) {
          system.handlerError.handleError(401, "Página no disponible.");
          return;
        } else{
          return true;
        }
      },
      auth: () => {
        const token = localStorage.getItem("Authorization");
        if(token){
          return true;
        }
        return false;
      },
    },
  },
  cookies: {
    get: (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    },
    set: (name, value, days = 7, path = "/") => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`;
    },
    remove: (name, path = "/") => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`;
    },
  },
  clearCookiesAndRedirect: () => {
    system.cookies.remove("SSID");
    system.cookies.remove("SSK");
    system.cookies.remove("APISS__NME");
    localStorage.clear();
    // Redirige al usuario
    router.push("/Login");
  },
  platform: {
    session: {
      force: function () {
        // Redirige al usuario a login.php
        window.location.href = V_Global_API + "login";
      },
    },
    location: {
      redirect: (url) => {
        // Redirige al usuario a la url pasada
        window.location.href = url;
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