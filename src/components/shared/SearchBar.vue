<template>
    <div class="relative w-full max-w-lg mx-auto">
        <div class="flex items-center">
            <input type="text" v-model="localSearchTerm" placeholder="Buscar productos o categorías..."
                class="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-highland-500)]"
                @focus="isFocused = true"
                @keydown.enter="executeSearch"/>
            <button @click="executeSearch"
                class="ml-2 p-2 bg-[var(--color-highland-500)] text-white rounded-md hover:bg-[var(--color-highland-700)] cursor-pointer focus:outline-none">
                <MagnifyingGlassIcon class="h-5 w-5" />
            </button>
        </div>

        <ul v-if="isFocused && searchStore.searchResults.length > 0"
            class="absolute left-0 w-full bg-white border border-[var(--color-highland-500)] shadow-md rounded-md mt-1 z-50">
            <li v-for="suggestion in searchStore.searchResults" :key="suggestion.id"
                class="px-4 py-2 cursor-pointer hover:bg-green-100 flex justify-between"
                @click="selectProduct(suggestion)">
                <strong>{{ suggestion.product_name }}</strong>
                <small v-if="suggestion.type" class="text-gray-500">({{ suggestion.type }})</small>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSearchStore } from "@/services/stores/searchStore";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";


const router = useRouter();
const route = useRoute();
const searchStore = useSearchStore();
const localSearchTerm = ref("");
const emit = defineEmits(["updateResults"]);
const isFocused = ref(false); // Nuevo estado para manejar la visibilidad del ul


watch(localSearchTerm, (newSearch) => {
    if (route.path === "/Catalogo") {
        searchStore.searchLocal(newSearch);
        emit("updateResults", searchStore.searchResults);
    }
});

const executeSearch = () => {
    if (!localSearchTerm.value.trim()) return;

    if (route.path !== "/Catalogo") {
        router.push({ path: "/Catalogo", query: { q: localSearchTerm.value.trim() } });
    } else {
        searchStore.searchLocal(localSearchTerm.value);
        emit("updateResults", searchStore.searchResults);
    }
};


const selectProduct = (product) => {
    localSearchTerm.value = product.product_name; // Mostrar el nombre en la barra
    emit("updateResults", [product]); // Emitir evento con el producto seleccionado
    isFocused.value = false; // Oculta el ul después de seleccionar un producto

};
</script>