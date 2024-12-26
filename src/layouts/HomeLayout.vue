<template>
    <div class="home-content p-6">
        <h2 class="text-2xl font-bold text-left mb-6 text-red-500">
            <router-link to="/Catalogo" class="hover:text-green-600" active-class="text-green-600">Has click aquí para ver más productos.</router-link>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            <ProductCard v-for="product in products" :key="product.id" :product="product" @click="openModal(product)"
                @add-to-cart="handleAddToCart" />
        </div>
        <!-- Modal de Producto -->
        <ProductModal :isOpen="isModalOpen" :product="selectedProduct" @close="closeModal"
            @add-to-cart="handleAddToCart" />
    </div>
</template>

<script>
import ProductCard from "@/components/ProductCard.vue";
import ProductService from "@/services/ProductService";
import ProductModal from "@/components/ProductModal.vue";

export default {
    components: { ProductCard, ProductModal },
    data() {
        return {
            products: [],
            isModalOpen: false,
            selectedProduct: {}, // Inicializa como objeto vacío
        };
    },
    async created() {
        await this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            try {
                this.products = await ProductService.getProducts();
                console.log("Productos cargados:", this.products);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        },
        openModal(product) {
            this.selectedProduct = { ...product }; // Asegura que sea una copia reactiva
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
            this.selectedProduct = {}; // Limpia el producto seleccionado
        },
        handleAddToCart(productId) {
            console.log(`Producto ${productId} añadido al carrito.`);
        },
    },
};
</script>

<style>
.home-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>