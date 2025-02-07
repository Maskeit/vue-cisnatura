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
                <!-- Card para agregar producto -->
                <CreateProduct @open-create-modal="openCreateProductModal" />

                <!-- Lista de productos -->
                <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
                    @click="openModal(product)" />
            </div>

            <!-- Modal para crear producto -->
            <CreateProductModal v-if="isCreateModalOpen" @close="closeCreateProductModal"
                @create-product="handleCreateProduct" />
            <!-- Modal -->
            <ProductModal v-if="isModalOpen" :isOpen="isModalOpen" :product="selectedProduct" @close="closeModal"
                @save-product="handleSaveProduct" @delete-product="handleDeleteProduct"
                @toggle-product="handleToggleProduct" />
            <!-- Paginación -->
            <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
        </div>
        <ConfirmationModal v-if="isConfirmationModalOpen" :isOpen="isConfirmationModalOpen" :title="'Confirmación'"
            :message="confirmationMessage" confirmText="Aceptar" @confirm="isConfirmationModalOpen = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "@/components/shared/Sidebar.vue";

import ProductCard from "@/components/Admin/Products/ProductCard.vue";
import CreateProduct from "@/components/Admin/Products/CreateProduct.vue";
import CreateProductModal from "@/components/Admin/Products/CreateProductModal.vue";
import ProductModal from "@/components/Admin/Products/ProductModal.vue";

import ConfirmationModal from "@/components/shared/ConfirmationModal.vue";
import Pagination from "@/components/shared/Pagination.vue";

import ProductService from "@/services/AdminServices/ProductService";
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
const isCreateModalOpen = ref(false);
const searchStore = useSearchStore();
const categories = searchStore.categories;

const isConfirmationModalOpen = ref(false);
const confirmationMessage = ref("");

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
});

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

// Modal de productos normales
const openModal = (product) => {
    selectedProduct.value = { ...product };
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
    selectedProduct.value = null;
};

// Modal del form para crear un producto nuevo
const openCreateProductModal = () => {
    isCreateModalOpen.value = true;
};

const closeCreateProductModal = () => {
    isCreateModalOpen.value = false;
};


const handleSaveProduct = async (data, hasImage) => {
    try {
        let productId = hasImage ? data.get("id") : data.id; // Extraer correctamente el ID
        if (!productId) {
            console.error("❌ Error: Falta el ID del producto en handleSaveProduct:", data);
            return;
        }

        let response;
        if (hasImage) {
            response = await ProductService.editProduct(data, true);
        } else {
            response = await ProductService.editProduct(data, false);
        }

        if (response === 201) {
            await fetchProducts(currentPage.value);
            EventBus.emit("showConfirmation", "✅ Producto actualizado exitosamente.");
        }
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
    }
};
const handleCreateProduct = async (formData) => {
    try {
        const response = await ProductService.createProduct(formData);
        if (response === 201) {
            confirmationMessage.value = "✅ El producto se ha creado correctamente.";
            isConfirmationModalOpen.value = true; // Mostrar modal de confirmación
            isCreateModalOpen.value = false; // Cerrar modal de creación
            await fetchProducts(currentPage.value); // Recargar productos
        } else {
            confirmationMessage.value = "❌ No se pudo crear el producto. Inténtalo de nuevo.";
            isConfirmationModalOpen.value = true; // Mostrar mensaje de error
        }
    } catch (error) {
        console.error("Error al crear el producto:", error);
        confirmationMessage.value = "⚠️ Hubo un error al crear el producto.";
        isConfirmationModalOpen.value = true;
    }
};
const handleDeleteProduct = async (productId) => {
    try {
        const response = await ProductService.deleteProduct(productId);
        if (response === 201) {
            // Verifica que products y filteredProducts sean arrays antes de filtrar
            if (!Array.isArray(products.value) || !Array.isArray(filteredProducts.value)) {
                console.error("Error: products o filteredProducts no son arrays:", {
                    products: products.value,
                    filteredProducts: filteredProducts.value
                });
                return;
            }
            // Filtra los productos correctamente usando `value`
            products.value = products.value.filter((product) => product.id !== productId);
            filteredProducts.value = filteredProducts.value.filter((product) => product.id !== productId);
        } else {
            alert("Error al eliminar el producto.");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
};
const handleToggleProduct = async (productId) => {
    try {
        const response = await ProductService.toggleProduct(productId);

        if (response === 201) {

            // Verifica que products es un array
            if (!Array.isArray(products.value)) {
                console.error("Error: products no es un array:", products.value);
                return;
            }

            // Encuentra el producto y actualiza su estado
            const product = products.value.find((p) => p.id == productId);
            if (product) {
                product.active = product.active == 1 ? 0 : 1;
            } else {
                console.warn("No se encontró el producto con ID:", productId);
            }
        } else {
            alert("Error al cambiar estado del producto");
        }
    } catch (error) {
        console.error("Error al alternar el estado del producto:", error);
    }
};
</script>
<style>
.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin: 0 auto;
}
</style>