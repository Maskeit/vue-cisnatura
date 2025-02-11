<template>
    <div @click="$emit('click', product)" class="product-card bg-white w-56 h-full shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer flex flex-col"
        data-product-id="product.id">
        <!-- Imagen -->
        <div class="w-full aspect-square bg-gray-200 flex items-center justify-center relative">
            <img :src="`${V_Global_IMG}${product.thumb}`" :alt="product.product_name"
                class="w-full h-full object-cover opacity-100 transition-opacity duration-300"
                @load="imageLoaded = true" />

            <div v-if="!imageLoaded" class="w-full h-full bg-gray-300 animate-pulse"></div>
        </div>

        <!-- Información del Producto -->
        <div class="p-4 flex-grow">
            <h3 class="text-lg font-bold text-center line-clamp-1 text-[var(--color-highland-700)]">
                {{ product.product_name }}
            </h3>
            <p class="text-gray-600 text-sm text-center mt-2 line-clamp-1" :title="product.description"
                v-html="product.description"></p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span class="text-md font-semibold text-[var(--color-highland-600)]">
                ${{ product.price }} MX
            </span>
            <button @click.stop="handleAddToCart"
                class="bg-white hover:bg-gray-100 cursor-pointer text-gray-800 font-medium py-2 px-4 rounded-full shadow flex items-center gap-1">
                <template v-if="addedToCart">
                    <span class="text-[var(--color-highland-500)]">✓</span>
                </template>
                <template v-else>
                    <span class="text-[var(--color-highland-500)]">Añadir</span>
                    <ShoppingCartIcon class="h-5 w-5 text-[var(--color-highland-500)]" />
                </template>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ShoppingCartIcon } from "@heroicons/vue/24/outline";
import CartService from "@/services/CartService";
import { V_Global_IMG } from "@/services/system";
import { Products } from "@/interfaces/Products"; // Importación correcta de la interfaz

// Props con tipado estricto
const props = defineProps<{ product: Products }>();

// Definir eventos emitidos
const emit = defineEmits<{
  (event: "click", product: Products): void;
}>();
const imageLoaded = ref(false);
// Estado reactivo para manejar si el producto fue añadido al carrito
const addedToCart = ref<boolean>(false);

// Método para agregar el producto al carrito
const handleAddToCart = async () => {
  try {
    const success = await CartService.addProductToCartWithAuth(props.product, 1);
    if (success) {
      addedToCart.value = true;
      setTimeout(() => {
        addedToCart.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
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
.product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.card-footer {
    margin-top: auto;
}
</style>