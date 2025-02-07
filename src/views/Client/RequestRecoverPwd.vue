<template>
    <div class="login-container">
        <!-- Botón para regresar al Home -->
        <router-link to="/" class="back-home-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7m0 0l7-7m-7 7h16" />
            </svg>
        </router-link>
        <div class="register-card">
            <h2 class="title">Reestablecer contraseña</h2>
            <p class="subtitle">Se te enviara un correo electrónico para confirmar tu identidad.</p>

            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input id="email" v-model="email" type="email" placeholder="Correo electrónico"
                        class="form-input" />
                    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>

                <button type="submit" class="btn-submit">Enviar</button>
                <p v-if="errorMessage" class="error-server-message">{{ errorMessage }}</p>
            </form>

            <div class="register-footer">
                <p>¿Ya tienes una cuenta? <router-link to="/Login" class="link">Inicia sesión aquí</router-link></p>
            </div>
            <img src="/logocis.svg" alt="Logo" class="h-16 m-auto" />
        </div>
        <!-- Modal para notificación -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <p>Revise su bandeja de correo electrónico para validar su correo.</p>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref } from "vue";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errors = ref({});
const errorMessage = ref("");
const showModal = ref(false);
const router = useRouter();

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!email.value) {
        errors.value.email = "El correo electrónico es obligatorio.";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.value.email = "Introduce un correo electrónico válido.";
        isValid = false;
    }
    return isValid;
};

const handleRegister = async () => {
    if (!validateForm()) return;

    try {
        const result = await AuthService.recoverPassword(email.value);
        if (result.status === 200) {
            showModal.value = true;
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || "Error al registrar el usuario.";
        console.error("Error al registrar:", error);
    }
};
</script>


<style scoped>
.register-container {
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

.register-card {
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

.input-password {
    display: flex;
    align-items: center;
}

.toggle-password {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: -30px;
    padding: 0;
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

.register-footer {
    margin-top: 1.5rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}
</style>