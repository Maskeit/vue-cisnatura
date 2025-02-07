<template>
  <div class="p-6 max-w-lg bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Información del Usuario</h1>

    <div class="card text-white p-4 rounded-md shadow-md">
      <p class="text-lg"><strong>Nombre:</strong> {{ userData.name }}</p>
      <p class="text-lg"><strong>Email:</strong> {{ userData.email }}</p>
      <p class="text-lg"><strong>Teléfono:</strong> {{ userData.phone || "No disponible" }}</p>
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUserStore } from "@/services/stores/userStore";

const userStore = useUserStore();

// Enlace reactivo para asegurar que los cambios en el store se reflejan en la UI
const userData = computed(() => ({
  name: userStore.name || "Cargando...",
  email: userStore.email || "Cargando...",
  phone: userStore.phone || "No disponible",
}));

onMounted(async () => {
  await userStore.fetchUserInfo();
});
</script>

<style scoped>
.card{
  background-color: #3b590b;
}
</style>