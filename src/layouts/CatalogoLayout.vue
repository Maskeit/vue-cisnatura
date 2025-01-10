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
            <ProductModal v-if="isModalOpen" :isOpen="isModalOpen" :product="selectedProduct" @close="closeModal"
                @add-to-cart="handleAddToCart" />

            <!-- Paginación -->
            <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
        </div>
    </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductModal from "@/components/ProductModal.vue";
import Pagination from "@/components/Pagination.vue";
import ProductService from "@/services/ProductService";
import CartService from "@/services/CartService";
import { EventBus } from "@/services/eventBus";
import { system } from "@/services/system";
export default {
    components: { Sidebar, ProductCard, ProductModal, Pagination },
    data() {
        return {
            products: [],
            filteredProducts: [],
            selectedProduct: null,
            currentPage: 1,
            totalPages: 0,
            limit: 16,
            isLoading: false,
            isModalOpen: false,
            categories: [
                { displayName: "Todos los productos", value: null },
                { displayName: "Tinturas", value: "tintura" },
                { displayName: "Dióxido de cloro", value: "cds" },
                { displayName: "Cursos/Talleres", value: "curso" },
                { displayName: "Paquetes", value: "paquete" },
                { displayName: "Productos Naturales", value: "otro" },
            ],
        };
    },
    watch: {
        "$route.query.category": {
            immediate: true,
            handler(newCategory) {
                if (newCategory) {
                    this.filterByCategory(newCategory);
                } else {
                    this.filteredProducts = [...this.products];
                }
            },
        },
        "$route.query.search": {
            immediate: true,
            handler(newSearch) {
                if (newSearch) {
                    this.filterProducts(newSearch);
                }
            },
        },
    },
    created() {
        // Escuchar eventos desde el EventBus
        EventBus.on("filterProducts", this.filterProducts);
        EventBus.on("serverSearch", this.serverSearch);
        EventBus.emit("categoriesUpdated", this.categories);
        // Cargar productos iniciales
        this.fetchProducts(this.currentPage)
            .then(() => {
                this.filteredProducts = [...this.products]; // Inicializar productos filtrados
            })
            .catch((error) => {
                console.error("Error al cargar productos iniciales:", error);
            });
        if (system.http.check.auth()) {
            this.fetchCart();
        }
    },
    beforeUnmount() {
        // Desregistrar eventos al desmontar el componente
        EventBus.off("filterProducts", this.filterProducts);
        EventBus.off("serverSearch", this.serverSearch);
    },
    methods: {
        async fetchCart() {
            try {
                const cartItems = await CartService.getCart();
                // Puedes emitir un evento para actualizar otros componentes
                EventBus.emit("cart-updated", cartItems);
            } catch (error) {
                console.error("Error al cargar el carrito:", error);
            }
        },
        async fetchProducts(page) {
            this.isLoading = true;
            try {
                const { products, total } = await ProductService.getCatalogoProducts(page, this.limit);
                this.products = products;
                this.filteredProducts = products;
                this.totalPages = Math.ceil(total / this.limit);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async changePage(page) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
                await this.fetchProducts(this.currentPage);
            }
        },
        /**
        * Filtra los productos cargados en memoria según la categoría seleccionada.
        */
        filterByCategory(categoryValue) {
            if (!this.products || this.products.length === 0) {
                console.error("No hay productos disponibles para filtrar.");
                return;
            }

            if (!categoryValue) {
                // Mostrar todos los productos si no hay filtro
                this.filteredProducts = [...this.products];
            } else {
                // Aplicar filtro por tipo
                this.filteredProducts = this.products.filter(
                    (product) =>
                        product.type &&
                        product.type.toLowerCase() === categoryValue.toLowerCase()
                );
            }
        },

        /**
         * Maneja las búsquedas locales de productos en tiempo real.
         */
        async filterProducts(query) {
            const lowerQuery = query.toLowerCase();

            if (!lowerQuery.trim()) {
                // Si el input está vacío, muestra los productos de la página actual
                this.filteredProducts = [...this.products];
                return;
            }

            // Filtrar productos cargados localmente
            this.filteredProducts = this.products.filter(
                (product) =>
                    product.product_name.toLowerCase().includes(lowerQuery) ||
                    product.description.toLowerCase().includes(lowerQuery) ||
                    product.type.toLowerCase().includes(lowerQuery)
            );

            if (this.filteredProducts.length === 0) {
                console.warn("No se encontraron productos en la búsqueda local.");
            }
        },

        /**
         * Busca productos en el servidor si no se encuentran en la caché local.
         */
        async serverSearch(query) {
            this.loading = true;
            try {
                const { products, message } = await ProductService.searchProducts(query);

                // Actualizar los productos filtrados con los resultados del servidor
                this.filteredProducts = products.length ? [...products] : [];
            } catch (error) {
                console.error("Error al buscar productos en el servidor:", error);
            } finally {
                this.loading = false;
            }
        },
        openModal(product) {
            this.selectedProduct = { ...product };
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
            this.selectedProduct = null;
        },
        handleAddToCart(productId) {
            console.log(`Producto ${productId} añadido al carrito.`);
        },
    },
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