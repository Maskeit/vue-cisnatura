<template>
    <div class="flex flex-col sm:flex-row">
        <!-- Sidebar -->
        <Sidebar :categories="categories" @filterCategory="filterByCategory" class="bg-gray-100" />

        <!-- Main Content -->
        <div class="flex-1 p-6">
            <div v-if="loading" class="text-center py-4">Cargando productos...</div>

            <!-- Productos -->
            <div class="product-list gap-4">
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
import { EventBus } from "@/services/eventBus";
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
            loading: false,
            isModalOpen: false,
            categoryMap: {
                "Todos los productos": null,
                "Tinturas": "tintura",
                "Dióxido de cloro": "cds",
                "Cursos/Talleres": "curso",
                "Paquetes": "paquete",
                "Productos Naturales": "otro",
            },
            categories: [
                "Todos los productos",
                "Tinturas",
                "Dióxido de cloro",
                "Cursos/Talleres",
                "Paquetes",
                "Productos Naturales",
            ],
        };
    },
    created() {
        // Escuchar eventos desde el EventBus
        EventBus.on("filterProducts", this.filterProducts);
        EventBus.on("serverSearch", this.serverSearch);

        // Cargar productos iniciales
        this.fetchProducts(this.currentPage)
            .then(() => {
                this.filteredProducts = [...this.products]; // Inicializar productos filtrados
            })
            .catch((error) => {
                console.error("Error al cargar productos iniciales:", error);
            });
    },
    beforeUnmount() {
        // Desregistrar eventos al desmontar el componente
        EventBus.off("filterProducts", this.filterProducts);
        EventBus.off("serverSearch", this.serverSearch);
    },
    methods: {
        async fetchProducts(page) {
            this.loading = true;
            try {
                const { products, total } = await ProductService.getCatalogoProducts(page, this.limit);
                this.products = products;
                this.filteredProducts = products;
                this.totalPages = Math.ceil(total / this.limit);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            } finally {
                this.loading = false;
            }
        },
        async changePage(page) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
                await this.fetchProducts(this.currentPage);
            }
        },
        filterByCategory(category) {
            const typeFilter = this.categoryMap[category];
            if (!this.products || this.products.length === 0) {
                console.error("No hay productos disponibles para filtrar.");
                return;
            }

            if (!typeFilter) {
                this.filteredProducts = this.products; // Mostrar todos los productos
            } else {
                this.filteredProducts = this.products.filter(
                    (product) =>
                        product.type &&
                        product.type.toLowerCase() === typeFilter.toLowerCase()
                );
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
        async fetchProducts(page) {
            this.loading = true;
            try {
                const { products, total } = await ProductService.getCatalogoProducts(page, this.limit);
                this.products = products;
                this.filteredProducts = products;
                this.totalPages = Math.ceil(total / this.limit);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            } finally {
                this.loading = false;
            }
        },
        async filterProducts(query) {
            const lowerQuery = query.toLowerCase();
            this.filteredProducts = this.products.filter(
                (product) =>
                    product.product_name.toLowerCase().includes(lowerQuery) ||
                    product.description.toLowerCase().includes(lowerQuery) ||
                    product.type.toLowerCase().includes(lowerQuery)
            );
            if (this.filteredProducts.length === 0) {
                console.warn("No se encontraron productos.");
            }
        },
        async serverSearch(query) {
            this.loading = true;
            try {
                const { products, message } = await ProductService.searchProducts(query);
                this.filteredProducts = products.length ? [...products] : [];
                this.searchMessage = message || null;
            } catch (error) {
                console.error("Error al buscar productos en el servidor:", error);
                this.searchMessage = "Error al buscar productos. Intente más tarde.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
<style>
@media (width<731px) {

    .product-list {
        align-items: center;
        justify-content: center;
        display: flex;
        flex-direction: column;
    }
}

.product-list {
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
}
</style>