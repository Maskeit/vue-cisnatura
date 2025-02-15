<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- Loader -->
        <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>

        <!-- Header -->
        <header class="bg-[var(--color-highland-500)] text-white py-4 text-center">
            <h1 class="text-lg font-semibold">Resumen de tu orden</h1>
        </header>

        <!-- Main Content -->
        <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
            <!-- Selected Address -->
            <SelectedAddress :address="selectedAddress" />

            <!-- Order Summary -->
            <OrderSummary :products="products" :subtotal="subtotal" :shippingCost="shippingCost" :total="total" />

            <!-- Warnings -->
            <OrderWarnings />

            <!-- Confirm Button -->
            <ConfirmButton @confirm="handleConfirm" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SelectedAddress from "@/components/Client/Address/SelectedAddress.vue";
import OrderSummary from "@/components/Client/Order/OrderSummary.vue";
import OrderWarnings from "@/components/Client/Order/OrderWarnings.vue";
import ConfirmButton from "@/components/Client/Order/ConfirmButton.vue";
import { UserAccountService } from "@/services/UserAccountService";
import { createCheckoutSession } from "@/services/stripeService";
import type { Address } from "@/interfaces/Address";
import type { ProductOrder } from "@/interfaces/ProductOrder";

// Estado reactivo
const isLoading = ref<boolean>(true);
const selectedAddress = ref<Address | null>(null);
const products = ref<ProductOrder[]>([]);
const subtotal = ref<number>(0);
const shippingCost = ref<number>(0);
const total = ref<number>(0);

// Método para obtener los detalles de la orden
const fetchOrderDetails = async () => {
    isLoading.value = true;
    try {
        const order = await UserAccountService.getOrder();
        if (order) {
            selectedAddress.value = order.address.length > 0 ? order.address[0] : null;
            products.value = order.products || [];
            subtotal.value = order.subtotal || 0;
            shippingCost.value = order.shippingCost || 0;
            total.value = order.total || 0;
        } else {
            console.error("No hay órdenes disponibles.");
        }
    } catch (error) {
        console.error("Error obteniendo los detalles de la orden:", error);
    } finally {
        isLoading.value = false;
    }
};

// Método para confirmar la orden y redirigir a Stripe
const handleConfirm = async () => {
    isLoading.value = true;
    try {
        const { url } = await createCheckoutSession();
        if (!url) throw new Error("No se pudo obtener la URL de checkout");

        window.location.href = url;
    } catch (error) {
        console.error("Error en la confirmación:", error);
        alert("Hubo un problema al redirigir al checkout. Por favor, intenta de nuevo.");
    } finally {
        isLoading.value = false;
    }
};

// Cargar los detalles de la orden al montar el componente
onMounted(fetchOrderDetails);
</script>