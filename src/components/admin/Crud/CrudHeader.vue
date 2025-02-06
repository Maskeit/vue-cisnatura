<template>
    <div class="flex justify-between items-center p-4 border-b">
        <h1 class="text-xl font-semibold">Gestión de Usuarios</h1>
        <div class="flex items-center space-x-2">
            <!-- Buscador (opcional) -->
            <input type="text" placeholder="Buscar..." class="border rounded px-2 py-1" v-model="searchTerm"
                @input="$emit('search', searchTerm)" />
            <!-- Botón para abrir el formulario de creación -->
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="$emit('nuevo-registro')">
                Nuevo
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const searchTerm = ref('');
</script>