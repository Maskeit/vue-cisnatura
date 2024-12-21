import $ from "jquery";

export const V_Global_API = "http://cisnaturatienda.local/api/";
export const V_Global_IMG = "http://cisnaturatienda.local/pimg/";
export const V_Domain = '';
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
      authorization: () => {
        try {
          const SSID = $.cookie('SSID');
          const SSK = $.cookie('SSK');
          const APISS__NME = $.cookie('APISS__NME');

          if (!SSID || !SSK || !APISS__NME) {
              //No se encontró el token de autenticación.
              return null;
          }

          return btoa(JSON.stringify({ SSID, SSK, APISS__NME }));
        } catch (error) {
            console.error("Error obteniendo el token de autenticación:", error);
            return null;
        }
      },
    },
    check: {
      isLoggedIn: () => {
        try {
          const SSID = $.cookie("SSID");
          const SSK = $.cookie("SSK");
          const APISS__NME = $.cookie("APISS__NME");

          return SSID && SSK && APISS__NME;
        } catch (error) {
          console.error(error);
        }
      },
    },
  },
  clearCookiesAndRedirect: () => {
    $.removeCookie("SSID", { path: "/" });
    $.removeCookie("SSK", { path: "/" });
    $.removeCookie("APISS__NME", { path: "/" });
    localStorage.clear();
    // Redirige al usuario
    window.location.href = V_Global + "login";
  },
  platform: {
    session: {
      force: function () {
        //redirige al usuario a login.php
        window.location.href = V_Global + "login";
      },
    },
    location: {
      redirect: (url) => {
        //redirige al usuario a la url pasada
        window.location.href = url;
      },
    },
  },
};