<template>
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Información del Usuario</h1>

    <div v-if="userStore.user" class="card text-black p-4 rounded-md shadow-md">
      <p class="text-lg"><strong>Nombre:</strong> {{ userStore.user.name }}</p>
      <p class="text-lg"><strong>Email:</strong> {{ userStore.user.email }}</p>
      <p class="text-lg"><strong>Teléfono:</strong> {{ userStore.user.telefono || "No disponible" }}</p>
    </div>

    <div v-else class="text-gray-500">Cargando información del usuario...</div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useUserStore } from "@/services/stores/userStore";

// Instancia del store
const userStore = useUserStore();

// Computed para obtener la información del usuario desde el store
const userData = computed(() => userStore.user ?? { name: "Cargando...", email: "Cargando...", telefono: "No disponible" });

// Cargar los datos del usuario al montar el componente solo si no están en el estado
onMounted(() => {
  if (!userStore.user) {
    userStore.fetchUserInfo();
  }
});
</script>