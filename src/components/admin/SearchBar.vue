<template>
    <div class="relative w-full max-w-lg mx-auto" ref="searchContainer">
        <div class="flex items-center">
            <input type="text" v-model="localSearchTerm" placeholder="Buscar productos o categorías..."
                class="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-highland-500)]"
                @input="filterProducts"
                @focus="isFocused = true"
                @blur="handleBlur"
                @keydown.enter="applySearch"
            />
            <button @click="clearSearch"
            class="ml-2 p-2 bg-[var(--color-highland-500)] text-white rounded-md hover:bg-[var(--color-highland-700)] cursor-pointer focus:outline-none">
                ✖
            </button>
        </div>

        <!-- Lista de coincidencias -->
        <ul v-if="isFocused && localSearchTerm.trim() !== '' && searchStore.searchResults.length > 0"
            class="absolute left-0 w-full bg-white border border-[var(--color-highland-500)] shadow-md rounded-md mt-1 z-50">
            <li v-for="suggestion in searchStore.searchResults" :key="suggestion.id"
                class="px-4 py-2 cursor-pointer hover:bg-green-100 flex justify-between"
                @mousedown.prevent="selectProduct(suggestion)">
                <strong>{{ suggestion.product_name }}</strong>
                <small v-if="suggestion.type" class="text-gray-500">({{ suggestion.type }})</small>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useSearchAdminStore } from "@/components/Admin/stores/searchAdminStore";

const searchStore = useSearchAdminStore();
const localSearchTerm = ref("");
const isFocused = ref(false);
const searchContainer = ref<HTMLElement | null>(null);

const emits = defineEmits(["search"]);

const filterProducts = () => {
    searchStore.searchAdminLocal(localSearchTerm.value);
};

/**
 * Oculta la lista cuando el usuario hace clic fuera
 */
const handleBlur = (event: FocusEvent) => {
    // Evita cerrar si el usuario hace clic en la lista de sugerencias
    setTimeout(() => {
        isFocused.value = false;
    }, 200);
};

const applySearch = () => {
    emits("search", localSearchTerm.value);
};

const clearSearch = () => {
    localSearchTerm.value = "";
    searchStore.clearSearch();
    emits("search", "");
    isFocused.value = false; // Ocultar lista cuando se borra la búsqueda
};

/**
 * Selecciona un producto y oculta la lista
 */
const selectProduct = (product: any) => {
    searchStore.filterSelectedProduct(product.id);
    isFocused.value = false;
    localSearchTerm.value = product.product_name; // Mostrar el nombre del producto en el input
};
</script>