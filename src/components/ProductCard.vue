<template>
    <div @click="$emit('click', product)"
        class="bg-white w-64 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
        data-product-id="product.id">
        <!-- Imagen -->
        <div class="w-full bg-white">
            <img :src="`http://cisnaturatienda.local/app/pimg/${product.thumb}`" :alt="product.product_name"
                class="w-full  object-contain p-4" />
        </div>

        <!-- Información del Producto -->
        <div class="p-4">
            <h3 class="text-lg font-bold text-center text-gray-800">
                {{ product.product_name }}
            </h3>
            <p class="text-gray-600 text-sm text-center mt-2 line-clamp-1" :title="product.description"
                v-html="product.description"></p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span class="text-xl font-semibold text-gray-800">
                ${{ product.price }} MX
            </span>
            <button @click.stop="$emit('add-to-cart', product.id)"
                class="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full shadow flex items-center gap-1">
                <span>Añadir</span>
                <ShoppingCartIcon class="h-5 w-5 text-gray-800" />
            </button>
        </div>
    </div>
</template>

<script>
import { ShoppingCartIcon } from "@heroicons/vue/24/outline";

export default {
    name: "ProductCard",
    components: { ShoppingCartIcon },
    props: {
        product: {
            type: Object,
            required: true,
        },
    },
    methods: {
        addToCart(productId) {
            this.$emit("add-to-cart", productId); // Emite el evento para agregar al carrito
        },
    },
};
</script>

<style scoped>
/* Estilo adicional si se necesita */
</style>