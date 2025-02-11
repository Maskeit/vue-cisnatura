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
                ${{ (product.price * cantidad).toFixed(2) }}
                <span class="text-xs text-gray-400">(${{ product.price.toFixed(2) }} c/u)</span>
            </p>
            <div class="flex items-center space-x-2 mt-2">
                <!-- Botón de disminuir -->
                <button v-if="cantidad > 1" @click="decrementQuantity" class="shadow-md rounded px-2 cursor-pointer hover:bg-gray-100">-</button>
                <!-- Mostrar la cantidad actual -->
                <span class="text-sm">{{ cantidad }}</span>
                <!-- Botón de incrementar -->
                <button @click="incrementQuantity" class="shadow-sm rounded px-2 cursor-pointer hover:bg-gray-100">+</button>
            </div>
        </div>

        <!-- Botón para eliminar -->
        <button @click="removeFromCart" class="text-red-500 hover:text-red-700 ml-4 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { V_Global_IMG } from "@/services/system";
import { Carrito } from "@/interfaces/Carrito";
import { Products } from "@/interfaces/Products";

// Definir las props con tipado fuerte
const props = defineProps<{
    product: Products;
    cartItem: Carrito;
}>();

// Variable reactiva local para manejar la cantidad
const cantidad = ref<number>(props.cartItem.cantidad);

// Sincronizar `cantidad` con la prop `cartItem.cantidad`
watch(() => props.cartItem.cantidad, (newCantidad) => {
    cantidad.value = newCantidad;
});

// Definir eventos con tipado
const emit = defineEmits<{
    (event: "update-quantity", cartItemId: number, cantidad: number): void;
    (event: "remove-product", cartItemId: number): void;
}>();

// Métodos con tipado seguro
const incrementQuantity = (): void => {
    if (!props.cartItem.carrito_id) {
        console.error("Error: cartItem.carrito_id es undefined en incrementQuantity", props.cartItem);
        return;
    }
    cantidad.value += 1;
    emit("update-quantity", props.cartItem.carrito_id, cantidad.value);
};

const decrementQuantity = (): void => {
    if (!props.cartItem.carrito_id) {
        console.error("Error: cartItem.carrito_id es undefined en decrementQuantity", props.cartItem);
        return;
    }
    if (cantidad.value > 1) {
        cantidad.value -= 1;
        emit("update-quantity", props.cartItem.carrito_id, cantidad.value);
    }
};

const removeFromCart = (): void => {
    if (!props.cartItem.carrito_id) {
        console.error("Error: cartItem.carrito_id es undefined en removeFromCart", props.cartItem);
        return;
    }
    emit("remove-product", props.cartItem.carrito_id); 
};
</script>