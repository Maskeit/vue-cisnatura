<!-- src/components/CookieConsentModal.vue -->
<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-opacity-80">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 class="text-lg font-semibold">Configuración de Privacidad</h2>
            <p class="mt-2 text-sm text-gray-600">
                Usamos cookies para mejorar la funcionalidad del sitio, analizar tráfico y personalizar contenido.
                Consulta nuestra <a href="/Cookies" class="text-blue-600 underline">Política de Cookies</a> y
                <a href="/public/info/advice.pdf" class="text-blue-600 underline">Aviso de Privacidad</a>.
            </p>
            <div class="mt-4 flex justify-end space-x-3">
                <button @click="declineCookies" class="px-4 py-2 bg-gray-200 rounded">Rechazar</button>
                <button @click="acceptCookies" class="px-4 py-2 bg-[var(--color-highland-600)] text-white rounded">Aceptar y
                    cerrar</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";

const isVisible = ref<boolean>(false);

const checkCookies = () => {
    if (!Cookies.get("cookieConsent")) {
        isVisible.value = true;
    }
};

const acceptCookies = () => {
    Cookies.set("cookieConsent", "accepted", { expires: 7, path: "/" });
    localStorage.setItem("cookieConsent", "accepted");
    isVisible.value = false;
};

const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    isVisible.value = false;
};

onMounted(() => {
    checkCookies();
});
</script>