<template>
    <div class="register-container">
        <!-- Botón para regresar al Home -->
        <router-link to="/" class="back-home-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7m0 0l7-7m-7 7h16" />
            </svg>
        </router-link>
        <div class="register-card">
            <h2 class="title">Registrarse</h2>
            <p class="subtitle">Introduce tus datos para crear una cuenta</p>

            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-group">
                    <label for="name">Nombre completo</label>
                    <input id="name" v-model="name" type="text" placeholder="Tu nombre" class="form-input" />
                    <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input id="email" v-model="email" type="email" placeholder="Correo electrónico"
                        class="form-input" />
                    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <div class="input-password">
                        <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                            placeholder="Contraseña" class="form-input" />
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                    </div>
                    <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
                </div>

                <div class="form-group">
                    <label for="password2">Repite la Contraseña</label>
                    <div class="input-password">
                        <input id="password2" v-model="password2" :type="showPassword2 ? 'text' : 'password'"
                            placeholder="Repite la contraseña" class="form-input" />
                        <button type="button" class="toggle-password" @click="showPassword2 = !showPassword2">
                            <i :class="showPassword2 ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                    </div>
                    <span v-if="errors.password2" class="error-message">{{ errors.password2 }}</span>
                </div>

                <!-- Mostrar el botón o el loader -->
                <div class="form-group">
                    <button v-if="!isLoading" type="submit" class="btn-submit">Registrarse</button>
                    <div v-else class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500"></div>
                    </div>
                </div>
                <div v-if="codeStatus === 409 || codeStatus === 400">
                    <p class="text-red-500">{{ errorMessage }}</p>
                </div>
                <div v-else-if="codeStatus === 500">
                    <p class="text-red-700 underline">Error en el servicio intente más tarde.</p>
                </div>
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
const password2 = ref("");
const showPassword = ref(false);
const showPassword2 = ref(false);
const errors = ref({});
const isLoading = ref(false);
const errorMessage = ref("");
const showModal = ref(false);
const router = useRouter();

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!name.value) {
        errors.value.name = "El nombre es obligatorio.";
        isValid = false;
    }

    if (!email.value) {
        errors.value.email = "El correo electrónico es obligatorio.";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.value.email = "Introduce un correo electrónico válido.";
        isValid = false;
    }

    if (!password.value) {
        errors.value.password = "La contraseña es obligatoria.";
        isValid = false;
    } else if (
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}/.test(password.value)
    ) {
        errors.value.password =
            "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un símbolo.";
        isValid = false;
    }

    if (!password2.value) {
        errors.value.password2 = "Repite la contraseña.";
        isValid = false;
    } else if (password.value !== password2.value) {
        errors.value.password2 = "Las contraseñas no coinciden.";
        isValid = false;
    }

    return isValid;
};
let codeStatus = ref("");
const handleRegister = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const { status, message } = await AuthService.register(name.value, email.value, password.value);
        if (status === 200) {
            showModal.value = true;
            setTimeout(() => {
                showModal.value = false;
                router.push("/Login");
            }, 5000);
        } else if (status === 400) {
            codeStatus.value = status
            errorMessage.value = "Hubo error en sus datos"
        } else if (status === 409) {
            codeStatus.value = status
            errorMessage.value = "Este correo ya esta registrado"
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