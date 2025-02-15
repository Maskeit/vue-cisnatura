<template>
  <router-view />
  <CookieConsent />
  <!-- Modal de advertencia global -->
  <GlobalWarningModal 
    :isVisible="isModalVisible" 
    :message="modalMessage" 
    confirmText="Iniciar Sesión"
    cancelText="Cerrar" 
    @confirm="redirectToLogin" 
    @cancel="hideModal" 
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { EventBus } from "@/services/eventBus";
import GlobalWarningModal from "@/components/shared/GlobalWarningModal.vue";
import CookieConsent from "@/components/shared/CookiesConsent.vue";
// Estado del modal
const isModalVisible = ref<boolean>(false);
const modalMessage = ref<string>("");

// Hook de Vue Router
const router = useRouter();

// Función para mostrar el modal
const showModal = (data: { message?: string }) => {
  modalMessage.value = data.message || "Acción requerida.";
  isModalVisible.value = true;
};

// Función para ocultar el modal
const hideModal = () => {
  isModalVisible.value = false;
};

// Función para redirigir al login
const redirectToLogin = () => {
  isModalVisible.value = false;
  router.push("/Login");
};

// Eventos del EventBus
onMounted(() => {
  EventBus.on("showModal", showModal);
});

onUnmounted(() => {
  EventBus.off("showModal", showModal);
});
</script>