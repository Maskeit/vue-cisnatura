export const V_Global_API = "http://cisnaturatienda.local/api/";
export const V_Global_IMG = "http://cisnaturatienda.local/pimg/";
export const V_Domain = "";

export const system = {
  authToken: null,
  // Método para inicializar el authToken una vez
  initializeAuth: function () {
    if (!this.authToken) {
      this.authToken = this.http.send.authorization();
    }
  },
  http: {
    send: {
      authorizationCookies: () => {
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
        try{
          const token = localStorage.getItem("Authorization");
          return token;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    },
    check: {
      isLoggedIn: () => {
        try {
          const SSID = system.cookies.get("SSID");
          const SSK = system.cookies.get("SSK");
          const APISS__NME = system.cookies.get("APISS__NME");

          return SSID && SSK && APISS__NME;
        } catch (error) {
          console.error(error);
          return false;
        }
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
    window.location.href = V_Global_API + "login";
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
};