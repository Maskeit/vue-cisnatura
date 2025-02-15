<template>
    <div class="relative w-full max-w-lg mx-auto">
        <div class="flex items-center">
            <input type="text" v-model="localSearchTerm" placeholder="Buscar productos o categorías..."
                class="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-highland-500)]"
                @input="filterProducts"
                @focus="isFocused = true"
                @blur="handleBlur"
                @keydown.enter="applySearch"/>
            <button @click="executeSearch"
                class="ml-2 p-2 bg-[var(--color-highland-500)] text-white rounded-md hover:bg-[var(--color-highland-700)] cursor-pointer focus:outline-none">
                <MagnifyingGlassIcon class="h-5 w-5" />
            </button>
            <!-- <button @click="clearSearch">
                Limpiar
            </button> -->
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
import { ref, computed } from "vue";
import { useSearchStore } from "@/services/stores/searchStore";
import { useProductsStore } from "@/services/stores/productStore";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const searchStore = useSearchStore();
const productStore = useProductsStore(); // Conectar con el catálogo
const localSearchTerm = ref("");
const isFocused = ref(false);

const emits = defineEmits(["search"]);

const filterProducts = () => {
    searchStore.searchLocal(localSearchTerm.value);
};

/**
 * Oculta la lista cuando el usuario hace clic fuera
 */
const handleBlur = () => {
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
};
/**
 * Selecciona un producto y lo muestra en el catálogo
 */

 const selectProduct = (product: any) => {
    // Si el usuario no está en el catálogo, lo redirigimos primero
    if (route.path !== "/") {
        router.push({ path: "/" }).then(() => {
            // Esperar un breve tiempo para asegurar que la vista cambie antes de filtrar
            setTimeout(() => {
                searchStore.filterSelectedProduct(product.id);
                productStore.products = searchStore.searchResults;
                isFocused.value = false;
                localSearchTerm.value = product.product_name;
            }, 300);
        });
    } else {
        // Si ya está en el catálogo, solo aplicamos el filtrado
        searchStore.filterSelectedProduct(product.id);
        productStore.products = searchStore.searchResults;
        isFocused.value = false;
        localSearchTerm.value = product.product_name;
    }
};
</script>