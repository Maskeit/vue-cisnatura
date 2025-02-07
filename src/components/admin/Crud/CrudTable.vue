<template>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo @</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefono</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actividad</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha de registro</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <CrudTableRow 
          v-for="item in items" 
          :key="item.id" 
          :item="item" 
          @editar="onEditar"
          @eliminar="onEliminar"
        />
      </tbody>
    </table>
  </template>
  
  <script setup lang="ts">
  import CrudTableRow from './CrudTableRow.vue';
  import type { User } from '@/interfaces/User';

  const props = defineProps<{
    items: User[];
  }>();
  
  const emits = defineEmits<{
    (e: 'editar', item: User): void;
    (e: 'eliminar', item: User): void;
  }>();
  
  function onEditar(item: User) {
    emits('editar', item);
  }
  
  function onEliminar(item: User) {
    emits('eliminar', item);
  }
  </script>