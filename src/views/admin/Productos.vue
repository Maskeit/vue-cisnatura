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

<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "@/components/shared/Sidebar.vue";
import ProductCard from "@/components/Admin/Products/ProductCard.vue";
import CreateProduct from "@/components/Admin/Products/CreateProduct.vue";
import CreateProductModal from "@/components/Admin/Products/CreateProductModal.vue";
import ProductModal from "@/components/Admin/Products/ProductModal.vue";
import ConfirmationModal from "@/components/shared/ConfirmationModal.vue";
import Pagination from "@/components/shared/Pagination.vue";

import { ProductService } from "@/services/Class/Admin/ProductService";
import { EventBus } from "@/services/eventBus";
import { system } from "@/services/system";

import { useSearchAdminStore } from "@/components/Admin/stores/searchAdminStore";

import type { Products } from "@/interfaces/Products";

// Instancia de Vue Router
const route = useRoute();
const router = useRouter();

// Estado Reactivo con Tipos
const products = ref<Products[]>([]);


const selectedProduct = ref<Products | null>(null);
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const limit = ref<number>(16);
const isLoading = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);
const isCreateModalOpen = ref<boolean>(false);

const searchStore = useSearchAdminStore();

const categories = searchStore.categories;
const isConfirmationModalOpen = ref<boolean>(false);
const confirmationMessage = ref<string>("");

// Instancia de la clase de servicios
const productService = new ProductService();
const filteredProducts = ref<Products[]>([]); // con este si se muestran los productos
watchEffect(() => {
    filteredProducts.value = searchStore.searchResults.length > 0
        ? [...searchStore.searchResults]
        : [...products.value]; // Si no hay búsqueda, mostrar todos los productos
});
/**
 * Filtrar productos en memoria por búsqueda
 */

const filterProducts = (query: string): void => {
    filteredProducts.value = query
        ? products.value.filter((product) =>
            product.product_name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.type?.toLowerCase().includes(query)
        )
        : [...products.value]; // Restaurar si la búsqueda está vacía
};

/**
 * Cargar Productos y Carrito al Montar
 */
onMounted(async () => {
    EventBus.on("filterProducts", filterProducts);
    EventBus.on("localSearch", localSearch);
    EventBus.emit("categoriesUpdated", categories);

    try {
        await fetchProducts(currentPage.value);
        filteredProducts.value = [...products.value];
    } catch (error) {
        console.error("Error al cargar productos iniciales:", error);
    }
});

/**
 * Cambiar de página en la paginación
 */
const changePage = async (page: number): Promise<void> => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        await fetchProducts(currentPage.value);
    }
};

/**
 * Filtrar productos por categoría
 */
const filterByCategory = (categoryValue: string): void => {
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

/**
 * Buscar productos en el servidor si no están en memoria
 */
const localSearch = async (query: string): Promise<void> => {
    if (!query || query.trim() === "") return;

    isLoading.value = true;
    try {
        const { products: fetchedProducts } = await productService.searchProducts(query);

        if (fetchedProducts.length > 0) {
            filteredProducts.value = [...fetchedProducts];
        } else {
            console.warn("No se encontraron productos en la búsqueda.");
            filteredProducts.value = [];
        }
    } catch (error) {
        console.error("Error al buscar productos en el servidor:", error);
        filteredProducts.value = [];
    } finally {
        isLoading.value = false;
    }
};

/**
 * Abrir y cerrar modal de producto
 */
const openModal = (product: Products): void => {
    selectedProduct.value = { ...product };
    isModalOpen.value = true;
};

const closeModal = (): void => {
    isModalOpen.value = false;
    selectedProduct.value = null;
};

/**
 * Abrir y cerrar modal de creación de producto
 */
const openCreateProductModal = (): void => {
    isCreateModalOpen.value = true;
};

const closeCreateProductModal = (): void => {
    isCreateModalOpen.value = false;
};

/**
 * Obtener productos de la API para el catálogo
 */
const fetchProducts = async (page: number): Promise<void> => {
    isLoading.value = true;
    try {
        const { products: fetchedProducts, total } = await productService.getCatalogoProducts(page, limit.value);
        products.value = fetchedProducts;
        filteredProducts.value = fetchedProducts;
        totalPages.value = Math.ceil(total / limit.value);
        searchStore.setAdminProducts(fetchedProducts);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    } finally {
        isLoading.value = false;
    }
};

const handleSaveProduct = async (data: FormData | Partial<Products>, hasImage: boolean): Promise<void> => {
    try {
        const productId = hasImage ? data.get("id") as string | null : (data as Products).id?.toString();
        if (!productId) {
            console.error("❌ Error: Falta el ID del producto en handleSaveProduct:", data);
            return;
        }

        const response = await productService.editProduct(data, hasImage);

        if (response === 201) {
            // Esperar un breve tiempo antes de recargar para que el usuario vea el cambio
            setTimeout(() => {
                window.location.reload();
            }, 500); // 500ms de espera antes de recargar
        }
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
    }
};

const handleCreateProduct = async (formData: FormData): Promise<void> => {
    try {
        const response = await productService.createProduct(formData);
        if (response === 201) {
            confirmationMessage.value = "✅ El producto se ha creado correctamente.";
            isConfirmationModalOpen.value = true;
            isCreateModalOpen.value = false;
            await fetchProducts(currentPage.value);
        } else {
            confirmationMessage.value = "❌ No se pudo crear el producto. Inténtalo de nuevo.";
            isConfirmationModalOpen.value = true;
        }
    } catch (error) {
        console.error("Error al crear el producto:", error);
        confirmationMessage.value = "⚠️ Hubo un error al crear el producto.";
        isConfirmationModalOpen.value = true;
    }
};

const handleDeleteProduct = async (productId: number): Promise<void> => {
    try {
        const response = await productService.deleteProduct(productId);
        if (response === 201) {
            if (!Array.isArray(products.value) || !Array.isArray(filteredProducts.value)) {
                console.error("Error: products o filteredProducts no son arrays:", {
                    products: products.value,
                    filteredProducts: filteredProducts.value
                });
                return;
            }
            products.value = products.value.filter(product => product.id !== productId);
            filteredProducts.value = filteredProducts.value.filter(product => product.id !== productId);
        } else {
            alert("Error al eliminar el producto.");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
};

const handleToggleProduct = async (productId: number): Promise<void> => {
    try {
        const status = await productService.toggleProduct(productId);

        if (status === 201) {
            // Buscar el producto en el array `products` y cambiar su estado en la UI
            const productIndex = products.value.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                products.value[productIndex] = {
                    ...products.value[productIndex],
                    active: products.value[productIndex].active === 1 ? 0 : 1
                };
            }

            // También actualizar en `filteredProducts` si se está filtrando
            const filteredIndex = filteredProducts.value.findIndex(p => p.id === productId);
            if (filteredIndex !== -1) {
                filteredProducts.value[filteredIndex] = {
                    ...filteredProducts.value[filteredIndex],
                    active: filteredProducts.value[filteredIndex].active === 1 ? 0 : 1
                };
            }
        } else {
            alert("Error al cambiar el estado del producto.");
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
