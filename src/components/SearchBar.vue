<template>
    <div class="flex items-center space-x-2">
        <!-- Input de búsqueda -->
        <input type="text" placeholder="Buscar" v-model="searchQuery" @keyup.enter="handleSearch"
            class="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-green-500" />

        <!-- Botón de búsqueda -->
        <button @click="handleSearch"
            class="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg px-4 py-2 flex items-center justify-center">
            <!-- Icono de lupa -->
            🔍
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchQuery: "", // Contiene el texto de búsqueda
        };
    },
    methods: {
        handleSearch() {
            // Lógica de búsqueda que será implementada
            console.log("Búsqueda realizada con:", this.searchQuery);
            // Aquí se podrá emitir un evento o ejecutar una petición al backend
        },
    },
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>