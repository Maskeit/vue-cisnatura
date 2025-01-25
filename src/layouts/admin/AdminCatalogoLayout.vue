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
                <AdminCreateProduct @open-create-modal="openCreateProductModal" />

                <!-- Lista de productos -->
                <AdminProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
                    @click="openModal(product)" />
            </div>

            <!-- Modal para crear producto -->
            <AdminCreateProductModal v-if="isCreateModalOpen" @close="closeCreateProductModal"
                @create-product="handleCreateProduct" />
            <!-- Modal -->
            <AdminProductModal v-if="isModalOpen" :isOpen="isModalOpen" :product="selectedProduct" @close="closeModal"
                @save-product="handleSaveProduct" @delete-product="handleDeleteProduct"
                @toggle-product="handleToggleProduct" />

            <!-- Paginación -->
            <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
        </div>
    </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import AdminProductCard from "@/components/admin/AdminProductCard.vue";
import AdminCreateProduct from "@/components/admin/AdminCreateProduct.vue";
import AdminCreateProductModal from "@/components/admin/AdminCreateProductModal.vue";
import AdminProductModal from "@/components/admin/AdminProductModal.vue";
import Pagination from "@/components/Pagination.vue";
import ProductServices from "@/services/AdminServices/ProductServices";
import { EventBus } from "@/services/eventBus";

export default {
    components: { Sidebar, AdminProductCard, AdminProductModal, AdminCreateProductModal, AdminCreateProduct, Pagination },
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
            isCreateModalOpen: false,
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
    },
    beforeUnmount() {
        // Desregistrar eventos al desmontar el componente
        EventBus.off("filterProducts", this.filterProducts);
        EventBus.off("serverSearch", this.serverSearch);
    },
    methods: {
        async fetchProducts(page) {
            console.log("Llamando a fetchProducts con página:", page); // Debug
            this.isLoading = true;
            try {
                const { products, total } = await ProductServices.getCatalogoProducts(page, this.limit);
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
                const { products, message } = await ProductServices.searchProducts(query);

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
        openCreateProductModal() {
            this.isCreateModalOpen = true;
        },
        closeCreateProductModal() {
            this.isCreateModalOpen = false;
        },
        async handleSaveProduct(data, hasImage) {
            try {
                let response;
                if (hasImage) {
                    // Llamar al método para enviar FormData
                    response = await ProductServices.editProduct(data, true);
                } else {
                    // Llamar al método para enviar JSON
                    response = await ProductServices.editProduct(data, false);
                }

                if (response === 201) {
                    console.log("Producto actualizado exitosamente:", response);
                    // Recargar productos después de guardar
                    await this.fetchProducts(this.currentPage);
                    // Emitir un evento al modal para que muestre el mensaje de éxito
                    EventBus.emit("showConfirmation", "Producto actualizado exitosamente.");
                }
            } catch (error) {
                console.error("Error al actualizar producto:", error);
            }
        },
        async handleCreateProduct(formData) {
            try {
                const response = await ProductServices.createProduct(formData);
                if (response === 201) {
                    console.log("Producto creado exitosamente:", response);
                    this.isCreateModalOpen = false; // Cierra el modal
                    await this.fetchProducts(this.currentPage); // Recarga los productos
                }
            } catch (error) {
                console.error("Error al crear el producto:", error);
            }
        },
        async handleDeleteProduct(productId) {
            try {
                const response = await ProductServices.deleteProduct(productId);
                if (response === 201) {
                    // Elimina el producto de la lista reactiva `products`
                    this.products = this.products.filter((product) => product.id !== productId);
                    this.filteredProducts = this.filteredProducts.filter((product) => product.id !== productId);
                } else {
                    alert("Error al eliminar el producto.");
                }
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        },
        async handleToggleProduct(productId) {
            try {
                const response = await ProductServices.toggleProduct(productId);
                if (response === 201) { // esto quiere decir que si se cambio la visibilidad en la base de datos. 
                    // Encuentra el producto en la lista y actualiza su estado "active"
                    const product = this.products.find((p) => p.id === productId);
                    if (product) {
                        product.active = product.active == 1 ? 0 : 1; // Alterna el estado
                    }
                } else {
                    alert("Error al cambiar estado del producto");
                }
            } catch (error) {
                console.error("Error al alternar el estado del producto:", error);
            }
        }
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