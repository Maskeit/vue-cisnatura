<template>
    <div class="flex flex-col sm:flex-row">
        <!-- Sidebar -->
        <Sidebar :categories="categories" @filterCategory="filterByCategory" class="bg-gray-100" />

        <!-- Main Content -->
        <div class="flex-1 p-6">
            <!-- Loader de carga -->
            <div v-if="isLoading" class="flex items-center justify-center h-full">
                <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
            </div>

            <!-- Productos -->
            <div class="product-list">
                <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
                    @click="openModal(product)" />
            </div>

            <!-- Modal -->
            <ProductModal v-if="isModalOpen" :isOpen="isModalOpen" :product="selectedProduct" @close="closeModal" />

            <!-- Paginación -->
            <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";

import ProductCard from "@/components/ProductCard.vue";
import ProductModal from "@/components/ProductModal.vue";

import Pagination from "@/components/Pagination.vue";

import ProductService from "@/services/ProductService";
import CartService from "@/services/CartService";
import { EventBus } from "@/services/eventBus";
import { system } from "@/services/system";
import { useSearchStore } from "@/services/stores/searchStore";

const route = useRoute();
const router = useRouter();

// Estado Reactivo
const products = ref([]);
const filteredProducts = ref([]);
const selectedProduct = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const limit = ref(16);
const isLoading = ref(false);
const isModalOpen = ref(false);

const searchStore = useSearchStore();

const categories = searchStore.categories;

// Observadores para cambios en la URL (búsqueda y categoría)
watch(() => searchStore.searchResults,
    (newResults) => {
        if (newResults.length > 0) {
            filteredProducts.value = newResults;
        } else {
            filteredProducts.value = [...products.value];
        }
    },
    { deep: true }
);

// Escuchar cambios en la URL (búsqueda en la barra de navegación)
watch(() => route.query.q, async (newSearch) => {
    if (newSearch && newSearch.trim()) {
        const lowerSearch = newSearch.toLowerCase();
        // Verificar si el producto ya está en caché (productos cargados en `products.value`)
        const cachedResults = products.value.filter(product =>
            product.product_name.toLowerCase().includes(lowerSearch) ||
            product.description.toLowerCase().includes(lowerSearch) ||
            product.type.toLowerCase().includes(lowerSearch)
        );
        if (cachedResults.length > 0) {
            // Si ya está en caché, usar esos productos y NO hacer la consulta al servidor
            filteredProducts.value = cachedResults;
            return; // Salir de la función para evitar hacer la consulta al servidor
        }
        // Si no está en caché, buscar en el servidor
        isLoading.value = true;
        try {
            const { products: serverResults } = await ProductService.searchProducts(newSearch);

            if (serverResults.length > 0) {
                filteredProducts.value = serverResults;
            } else {
                console.warn("No se encontraron productos en la búsqueda en el servidor.");
                filteredProducts.value = [];
            }
        } catch (error) {
            console.error("Error en la búsqueda en el servidor:", error);
            filteredProducts.value = [];
        } finally {
            isLoading.value = false;
        }
    } else {
        // Si no hay búsqueda activa, restaurar todos los productos de la primera página
        filteredProducts.value = [...products.value];
    }
}, { immediate: true });

// Filtrar productos en memoria por búsqueda
const filterProducts = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    filteredProducts.value = lowerQuery
        ? products.value.filter((product) =>
            product.product_name.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            product.type.toLowerCase().includes(lowerQuery)
        )
        : [...products.value];

    if (!filteredProducts.value.length) {
        console.warn("No se encontraron productos en la búsqueda local.");
    }
};
// Cargar Productos y Carrito al Montar
onMounted(async () => {
    EventBus.on("filterProducts", filterProducts);
    EventBus.on("serverSearch", serverSearch);
    EventBus.emit("categoriesUpdated", categories);

    try {
        await fetchProducts(currentPage.value);
        filteredProducts.value = [...products.value];
    } catch (error) {
        console.error("Error al cargar productos iniciales:", error);
    }

    if (system.http.check.auth()) {
        await fetchCart();
    }
});


// Obtener el carrito
const fetchCart = async () => {
    try {
        const cartItems = await CartService.getCart();
        EventBus.emit("cart-updated", cartItems);
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
    }
};

// Obtener productos de la API para el catalogo y paginas
const fetchProducts = async (page) => {
    isLoading.value = true;
    try {
        const { products: fetchedProducts, total } = await ProductService.getCatalogoProducts(page, limit.value);

        products.value = fetchedProducts;
        filteredProducts.value = fetchedProducts;
        totalPages.value = Math.ceil(total / limit.value);
        // Guardamos los productos en el estado global de Pinia
        searchStore.setProducts(fetchedProducts);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    } finally {
        isLoading.value = false;
    }
};

// Cambiar de página en la paginación
const changePage = async (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        await fetchProducts(currentPage.value);
    }
};

// Filtrar productos por categoría
const filterByCategory = (categoryValue) => {
    if (!products.value.length) {
        console.error("No hay productos disponibles para filtrar.");
        return;
    }

    filteredProducts.value = categoryValue
        ? products.value.filter((product) =>
            product.type?.toLowerCase() === categoryValue.toLowerCase()
        )
        : [...products.value];
};

// Buscar productos en el servidor si no están en memoria
const serverSearch = async (query) => {
    if (!query || query.trim() === "") return;

    isLoading.value = true;
    try {
        // Llamar al método de búsqueda del ProductService
        const { products, message } = await ProductService.searchProducts(query);

        // Validar si se encontraron productos
        if (products.length > 0) {
            filteredProducts.value = [...products];
        } else {
            console.warn(message || "No se encontraron productos en la búsqueda.");
            filteredProducts.value = [];
        }
    } catch (error) {
        console.error("Error al buscar productos en el servidor:", error);
        filteredProducts.value = [];
    } finally {
        isLoading.value = false;
    }
};

// Modal de productos
const openModal = (product) => {
    selectedProduct.value = { ...product };
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
    selectedProduct.value = null;
};
</script>
<style scoped>
.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin: 0 auto;
}
</style>