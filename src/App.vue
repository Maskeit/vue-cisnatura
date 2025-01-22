<template>
  <router-view />
  <!-- Modal de advertencia global -->
  <GlobalWarningModal :isVisible="isModalVisible" :message="modalMessage" confirmText="Iniciar Sesión"
    cancelText="Cerrar" @confirm="redirectToLogin" @cancel="hideModal" />
</template>

<script>
import { EventBus } from "@/services/eventBus";
import GlobalWarningModal from "@/components/GlobalWarningModal.vue";

export default {
  components: { GlobalWarningModal },
  data() {
    return {
      isModalVisible: false, // Controla si el modal es visible
      modalMessage: "", // Mensaje dinámico del modal
    };
  },
  mounted() {
    // Escucha el evento global emitido por el EventBus
    EventBus.on("showModal", this.showModal);
  },
  beforeUnmount() {
    // Limpia los eventos del EventBus
    EventBus.off("showModal", this.showModal);
  },
  methods: {
    showModal(data) {
      // Configura el mensaje del modal y lo muestra
      this.modalMessage = data.message || "Acción requerida.";
      this.isModalVisible = true;
    },
    redirectToLogin() {
      // Oculta el modal y redirige al login
      this.isModalVisible = false;
      this.$router.push("/Login");
    },
    hideModal() {
      // Simplemente oculta el modal
      this.isModalVisible = false;
    },
  },
};
</script>

<style>
/* Estilos globales opcionales */
</style>