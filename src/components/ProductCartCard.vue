<template>
    <div class="flex items-center bg-white shadow-md rounded-lg p-4 mb-4">
        <!-- Imagen del producto -->
        <div class="w-20 h-20 flex-shrink-0">
            <img :src="`${V_Global_IMG}${product.thumb}`" alt="Product Image"
                class="w-full h-full object-cover rounded-md" />
        </div>

        <!-- Detalles del producto -->
        <div class="flex-grow ml-4">
            <h3 class="font-bold text-lg">{{ product.product_name }}</h3>
            <!-- Mostrar precio calculado -->
            <p class="text-sm text-gray-500">
                ${{ (product.price * product.cantidad).toFixed(2) }}
                <span class="text-xs text-gray-400">(${{ product.price.toFixed(2) }} c/u)</span>
            </p>
            <div class="flex items-center space-x-2 mt-2">
                <!-- Botón de disminuir -->
                <button v-if="product.cantidad > 1" @click="decrementQuantity" class="border rounded px-2">-</button>
                <!-- Mostrar la cantidad actual -->
                <span class="text-sm">{{ product.cantidad }}</span>
                <!-- Botón de incrementar -->
                <button @click="incrementQuantity" class="border rounded px-2">+</button>
            </div>
        </div>


        <!-- Botón para eliminar -->
        <button @click="removeFromCart" class="text-red-500 hover:text-red-700 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { V_Global_IMG } from "@/services/system.js";

// Props
const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

// Emitir eventos
const emit = defineEmits(["update-quantity", "remove-product"]);

// Métodos
const incrementQuantity = () => {
    emit("update-quantity", props.product.productId, props.product.cantidad + 1);
};

const decrementQuantity = () => {
    if (props.product.cantidad > 1) {
        emit("update-quantity", props.product.productId, props.product.cantidad - 1);
    }
};

const removeFromCart = () => {
    emit("remove-product", props.product.productId);
};
</script>