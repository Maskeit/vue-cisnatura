<template>
    <div class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Productos</h2>
        <ul class="space-y-4">
            <li v-for="product in products" :key="product.productId"
                class="flex flex-col space-y-1 border-b pb-4 last:border-none last:pb-0">
                <div class="flex justify-between items-start">
                    <span class="text-gray-700 font-medium">{{ product.name }}</span>
                    <span class="text-sm text-gray-500">(x{{ product.quantity }})</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Precio unitario:</span>
                    <span>${{ product.unitPrice.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm font-semibold text-gray-700">
                    <span>Total:</span>
                    <span>${{ product.totalPrice.toFixed(2) }}</span>
                </div>
            </li>
        </ul>

        <hr class="my-4" />

        <div class="text-sm text-gray-600 space-y-1">
            <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
                <span>Costo de envío:</span>
                <span>${{ shippingCost.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-bold">
                <span>Total a pagar:</span>
                <span>${{ total.toFixed(2) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

// Definir la interfaz para los productos
interface Product {
    productId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

// Definir las props con sus tipos
defineProps({
    products: {
        type: Array as PropType<Product[]>,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    shippingCost: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
});
</script>