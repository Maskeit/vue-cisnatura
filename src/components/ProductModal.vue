<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full h-auto">
            <!-- Header -->
            <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-xl font-bold">{{ product.product_name }}</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                    <XMarkIcon class="h-6 w-6" />
                </button>
            </div>

            <!-- Modal Body -->
            <div class="flex flex-col md:flex-row h-auto overflow-auto">
                <!-- Imagen -->
                <div class="w-full md:w-1/2 p-4 flex items-center justify-center bg-gray-50">
                    <img :src="`http://cisnaturatienda.local/app/pimg/${product.thumb}`" :alt="product.product_name"
                        class="w-full max-h-64 md:max-h-full object-contain rounded" />
                </div>

                <!-- Contenido -->
                <div class="w-full md:w-1/2 p-4 overflow-y-auto max-h-96">
                    <h3 class="text-lg font-semibold mb-2">{{ product.product_name }}</h3>
                    <p class="text-gray-700 leading-relaxed" v-html="product.description"></p>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white">
                <span class="text-2xl font-bold">${{ product.price }} MX</span>
                <button @click="addToCart(product.id)"
                    class="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full shadow flex items-center gap-1">
                    <template v-if="addedToCart">
                        <span>✓</span>
                        <span>Agregado</span>
                    </template>
                    <template v-else>
                        <span>Añadir</span>
                        <ShoppingCartIcon class="h-5 w-5 text-gray-800" />
                    </template>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/vue/24/solid";
import CartManager from "@/services/CartManager";

export default {
    components: { XMarkIcon, ShoppingCartIcon },
    props: {
        isOpen: { type: Boolean, default: false },
        product: { type: Object, required: true },
    },
    data() {
        return {
            addedToCart: false, // Estado temporal para mostrar el mensaje de éxito
        };
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        async addToCart(productId) {
            const success = await CartManager.addProductToCart(this.product, 1);
            if (success) {
                this.$emit("add-to-cart", productId);
                this.addedToCart = true;
                setTimeout(() => {
                    this.addedToCart = false;
                }, 2000);
            }
        },
    },
};
</script>