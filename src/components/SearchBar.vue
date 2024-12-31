<template>
    <div class="flex flex-grow items-center space-x-2">
        <!-- Botón de categorías -->
        <div class="relative">
            <button @click="toggleCategoryDropdown"
                class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-4 py-2 rounded-l-md flex items-center">
                <span class="hidden lg:block">Categorías</span>
                <ChevronDownIcon class="h-5 w-5" />
            </button>
            <!-- Dropdown de categorías -->
            <ul v-if="categoryDropdownOpen"
                class="absolute z-10 bg-white shadow-md border mt-2 rounded-md w-48 text-sm">
                <li v-for="category in categories" :key="category.value" @click="handleCategorySelect(category.value)"
                    class="hover:bg-green-100 px-4 py-2 cursor-pointer">
                    {{ category.displayName }}
                </li>
            </ul>
        </div>

        <!-- Barra de búsqueda -->
        <div class="flex flex-grow">
            <input v-model="searchQuery" @input="handleRealTimeSearch" @keydown.enter="handleSearch" type="text"
                placeholder="Buscar productos..."
                class="border-t border-b border-gray-300 p-2 w-full focus:outline-none" />
            <button @click="handleSearch"
                class="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-md focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { EventBus } from "@/services/eventBus";

export default {
    props: {
        categories: {
            type: Array,
            required: true,
        },
    },
    components: {
        ChevronDownIcon,
    },
    data() {
        return {
            categoryDropdownOpen: false,            
            searchQuery: "", // Almacena la búsqueda actual
            searchError: null, // Error al buscar            
            searchResults: [], // Resultados encontrados
            localProducts: [], // Productos cargados en memoria
        };
    },
    methods: {
        toggleCategoryDropdown() {
            this.categoryDropdownOpen = !this.categoryDropdownOpen;
        },
        handleCategorySelect(categoryValue) {
            this.categoryDropdownOpen = false; // Cierra el dropdown
            this.$router.push({
                path: "/Catalogo",
                query: { category: categoryValue },
            });
        },
        handleRealTimeSearch() {
            EventBus.emit("filterProducts", this.searchQuery.trim());
        },
        handleSearch() {
            if (!this.searchQuery.trim()) {
                this.searchError = "Por favor, ingresa un término para buscar.";
                return;
            }
            EventBus.emit("serverSearch", this.searchQuery);
        },
    },
};
</script>
<style>

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.cat-list {
    padding: 8px 16px;
    cursor: pointer;
}

.cat-list:last-child {
    border-bottom: none;
}

.cat-list:hover {
    background-color: #f0f0f0;
}
</style>