<template>
  <div class="login-container">
    <!-- Botón para regresar al Home -->
    <router-link to="/" class="back-home-btn">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7m0 0l7-7m-7 7h16" />
      </svg>
    </router-link>
    <div class="login-card">
      <h2 class="title">Iniciar Sesión</h2>
      <p class="subtitle">Introduce tus credenciales para acceder a tu cuenta de Cisnatura</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input id="email" v-model="email" type="email" placeholder="Correo electrónico" class="form-input" />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" placeholder="Contraseña" class="form-input" />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Mostrar el botón o el loader -->
        <div class="form-group">
          <button v-if="!isLoading" type="submit" class="btn-submit">Iniciar Sesión</button>
          <div v-else class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500"></div>
          </div>
        </div>
        <div v-if="codeStatus === 401 || codeStatus === 400 || codeStatus === 404">
          <p class="text-red-500">{{ errorMessage }}</p>
          <p><router-link class="text-red-700 underline" to="/RequestRecover">No recuerdo mi
              contraseña</router-link></p>
        </div>
        <div v-else-if="codeStatus === 500">
          <p class="text-red-700 underline">Error en el servicio intente más tarde.</p>
        </div>
      </form>
      <div class="login-footer">
        <p>¿No tienes una cuenta? <router-link to="/Register" class="link">
            Registrarse
          </router-link></p>
      </div>
      <img src="/logocis.svg" alt="Logo" class="h-16 m-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Auth } from "@/services/Class/Client/Auth";
import Cookies from "js-cookie";

const router = useRouter();

// Definimos variables reactivas con tipos
const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");
const errors = ref<{ email?: string; password?: string }>({});
const isLoading = ref<boolean>(false);
const codeStatus = ref<number | null>(null);

// Función para validar los inputs
const validateInputs = (): boolean => {
  const validationErrors: { email?: string; password?: string } = {};

  if (!email.value) {
    validationErrors.email = "El correo electrónico es obligatorio.";
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    validationErrors.email = "Introduce un correo válido.";
  }

  if (!password.value) {
    validationErrors.password = "La contraseña es obligatoria.";
  } else if (password.value.length < 6) {
    validationErrors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  errors.value = validationErrors;
  return Object.keys(validationErrors).length === 0;
};
const auth = new Auth();
// Método para manejar el inicio de sesión
const handleLogin = async (): Promise<void> => {
  if (!validateInputs()) return;

  try {
    isLoading.value = true;
    const { status, token } = await auth.login({ email: email.value, password: password.value });

    if (status === 200 && token) {
      // Autenticación exitosa
      localStorage.setItem("Authorization", token);
      Cookies.set("Authorization", token, { expires: 7, path: "/" });
      router.push("/");
    } else if ([401, 400, 404].includes(status)) {
      errorMessage.value = "Datos incorrectos";
      codeStatus.value = status;
    }
  } catch (error) {
    // Errores del servidor o de red
    errorMessage.value = "Error en el servicio, intente más tarde.";
    codeStatus.value = 500;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.back-home-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #f1f5f9;
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s, transform 0.2s;
}

.back-home-btn:hover {
  background-color: #e5e7eb;
  transform: scale(1.1);
}

.back-home-btn svg {
  height: 1.5rem;
  width: 1.5rem;
  color: #374151;
}

.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: border 0.2s;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background-color: #505f2b;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #7c8a6f;
}

.error-message,
.error-server-message {
  color: #d9534f;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: left;
}

.link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}

.login-footer {
  margin-top: 1.5rem;
}
</style>