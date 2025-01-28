<template>
    <div>
      <h1>Información del Usuario</h1>
      <p><strong>Nombre:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Teléfono:</strong> {{ user.phone }}</p>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from "@/services/stores/userStore";
  const user = useUserStore();
  </script>