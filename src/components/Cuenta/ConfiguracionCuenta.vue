<template>
    <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Configuración de Cuenta</h2>

        <!-- Sección: Cambiar Teléfono -->
        <div class="mb-6">
            <label for="telefono" class="block text-sm font-medium text-gray-700 mb-2">Número de Teléfono</label>
            <input v-model="telefono" type="text" id="telefono"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Ingresa tu nuevo número" />
            <button @click="guardarTelefono"
                class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition">
                Guardar Cambios
            </button>
        </div>

        <!-- Sección: Cambiar Contraseña -->
        <!-- <div class="mt-8 border-t pt-6">
            <h3 class="text-lg font-medium text-gray-800 mb-3">Seguridad</h3>
            <p class="text-gray-600 mb-4">Para cambiar tu contraseña, accede al siguiente formulario:</p>
            <router-link to="/Cuenta/Reestablecer"
                class="block text-center w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition">
                Cambiar Contraseña
            </router-link>
        </div> -->
    </div>
</template>

<script setup>
import { ref } from "vue";
import UserAccountService from "@/services/UserAccountService";

const telefono = ref(""); // Estado reactivo para el teléfono


const guardarTelefono = async () => {
    if (!telefono.value.trim()) {
        alert("Por favor, ingresa un número de teléfono válido.");
        return;
    }

    const response = await UserAccountService.updateUserInfo({ telefono: telefono.value });
    console.log(response);
};
</script>