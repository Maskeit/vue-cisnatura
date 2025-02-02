<template>
    <div @click="$emit('click', product)"
        class="product-card bg-white w-56 shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
        data-product-id="product.id">
        <!-- Imagen -->
        <div class="w-full bg-white">
            <img :src="`${V_Global_IMG}${product.thumb}`" :alt="product.product_name"
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
            <span class="text-md font-semibold text-gray-800">
                ${{ product.price }} MX
            </span>
            <button @click.stop="handleAddToCart"
                class="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full shadow flex items-center gap-1">
                <template v-if="addedToCart">
                    <span>✓</span>
                </template>
                <template v-else>
                    <span>Añadir</span>
                    <ShoppingCartIcon class="h-5 w-5 text-gray-800" />
                </template>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { ShoppingCartIcon } from "@heroicons/vue/24/outline";
import CartManager from "@/services/CartManager";
import { V_Global_IMG } from "@/services/system.js";

// Props
const props = defineProps({
    product: {type: Object, required: true},
});

// Estado reactivo
const addedToCart = ref(false);

// Métodos
const handleAddToCart = async () => {
    const productData = {
        pid: props.product.id, // Asegura que se tome el ID correcto
        cantidad: 1
    };
    const success = await CartManager.addProductToCart(productData.pid, productData.cantidad);
    if (success) {
        addedToCart.value = true;
        setTimeout(() => {
            addedToCart.value = false;
        }, 2000);
    }
};
</script>

<style scoped>
/* Estilo adicional si se necesita */
@media (width<500px) {
    .product-card {
        min-width: calc(100% - 2rem);
    }
}
</style>