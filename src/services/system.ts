import router from "@/router";
import Cookies from "js-cookie";

// Definir la URL base desde variables de entorno
export const V_Global_API: string = import.meta.env.VITE_APP_API_URL || "";
export const V_Global_IMG: string = import.meta.env.VITE_APP_IMG_URL || "";
export const V_Global_Domain: string = import.meta.env.VITE_APP_DOMAIN || "";
export const V_Domain: string = "";

// Interfaz para la configuración del sistema
interface SystemConfig {
  authToken: string | null;
  initializeAuth: () => string | null;
  http: HttpConfig;
  handlerError: HandlerErrorConfig;
}

// Interfaz para la configuración HTTP
interface HttpConfig {
  send: {
    authorization: () => string | null;
  };
  check: {
    live: () => boolean;
    auth: () => boolean;
  };
}

// Interfaz para manejo de errores
interface HandlerErrorConfig {
  handleError: (errorCode?: number, errorMessage?: string) => void;
}

// Implementación de `system`
export const system: SystemConfig = {
  authToken: null, // ✅ Ahora es modificable

  // Método para inicializar `authToken` una vez
  initializeAuth(): string | null {
    if (!this.authToken) {
      this.authToken = this.http.send.authorization();
    }
    return this.authToken;
  },

  http: {
    send: {
      authorization(): string | null {
        try {
          return Cookies.get("Authorization") || localStorage.getItem("Authorization") || null;
        } catch (error) {
          console.error("Error obteniendo el token:", error);
          return null;
        }
      },
    },

    check: {
      live(): boolean {
        const token = Cookies.get("Authorization");
        if (!token) {
          system.handlerError.handleError(401, "Página no disponible.");
          return false;
        }
        return true;
      },
      auth(): boolean {
        return !!Cookies.get("Authorization");
      },
    },
  },

  handlerError: {
    handleError(errorCode: number = 500, errorMessage: string = "Ha ocurrido un error inesperado."): void {
      router.push({
        name: "Error",
        query: { code: errorCode.toString(), message: errorMessage },
      });
    },
  },
};

// Ejecutar `initializeAuth()` antes de cargar rutas
system.initializeAuth();