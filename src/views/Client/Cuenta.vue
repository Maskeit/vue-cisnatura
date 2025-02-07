<template>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <SidebarCuenta class="flex-shrink-0" />
  
      <!-- Contenido Principal -->
      <div class="flex-1 p-6">
        <!-- El router-view se envuelve en keep-alive para conservar el estado de cada panel -->
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import SidebarCuenta from '@/components/Client/Cuenta/SidebarCuenta.vue';
  </script>