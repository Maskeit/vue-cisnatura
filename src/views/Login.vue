<template>
  <div class="login-container">

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
        <p v-if="errorMessage" class="error-server-message">{{ errorMessage }}</p>
      </form>
      <div class="login-footer">
        <p>¿No tienes una cuenta? <router-link to="/Register" class="link">
            Registrarse
          </router-link></p>
      </div>
      <img src="/icons/logocis.svg" alt="Logo" class="h-16 m-auto" />
    </div>
  </div>
</template>

<script>
import { AuthService } from "@/services/AuthService";
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      errors: {},
      isLoading: false,
    };
  },
  methods: {
    validateInputs() {
      let errors = {};
      if (!this.email) {
        errors.email = "El correo electrónico es obligatorio.";
      } else if (!/\S+@\S+\.\S+/.test(this.email)) {
        errors.email = "Introduce un correo válido.";
      }

      if (!this.password) {
        errors.password = "La contraseña es obligatoria.";
      } else if (this.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres.";
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async handleLogin() {
      if (!this.validateInputs()) {
        return;
      }
      try {
        this.isLoading = true;
        const result = await AuthService.login(this.email, this.password);
        if (result && result.data) {
          const token = result.data.Authorization;
          localStorage.setItem("Authorization", token);
          Cookies.set('SSK', token, { expires: 7, path: '' });
          this.$router.push("/Catalogo");
        }
      } catch (error) {
        this.errorMessage = "Credenciales incorrectas o error en el servidor";
        console.error("Error al iniciar sesión:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
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