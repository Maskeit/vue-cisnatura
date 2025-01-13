<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- Loader -->
        <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>

        <!-- Header -->
        <header class="bg-green-500 text-white py-4 text-center">
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

<script>
import SelectedAddress from "@/components/SelectedAddress.vue";
import OrderSummary from "@/components/OrderSummary.vue";
import OrderWarnings from "@/components/OrderWarnings.vue";
import ConfirmButton from "@/components/ConfirmButton.vue";
import { UserAccountService } from "@/services/UserAccountService";
import { createCheckoutSession } from "@/services/stripeService";

export default {
    components: {
        SelectedAddress,
        OrderSummary,
        OrderWarnings,
        ConfirmButton,
    },
    data() {
        return {
            isLoading: true,
            selectedAddress: {},
            products: [],
            subtotal: 0,
            shippingCost: 0,
            total: 0,
        };
    },
    methods: {
        async fetchOrderDetails() {
            this.isLoading = true; // Activar loader
            try {
                const data = await UserAccountService.getOrder(); // Consumir el servicio directamente                

                if (data) {
                    this.selectedAddress = data.address[0];
                    this.products = data.products;
                    this.subtotal = data.subtotal;
                    this.shippingCost = data.shippingCost;
                    this.total = data.total;
                } else {
                    console.error("Error en los datos de la orden:", data.message || "Datos vacíos");
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                this.isLoading = false; // Desactivar loader
            }
        },
        async handleConfirm() {
            this.isLoading = true;

            try {
                // Llama al backend para crear la sesión de checkout
                const { url } = await createCheckoutSession();

                if (!url) {
                    throw new Error("No se pudo obtener la URL de checkout");
                }

                // Redirige al usuario al checkout de Stripe
                window.location.href = url;
            } catch (error) {
                console.error("Error en la confirmación:", error);
                alert("Hubo un problema al redirigir al checkout. Por favor, intenta de nuevo.");
            } finally {
                this.isLoading = false;
            }
        }
    },
    mounted() {
        this.fetchOrderDetails();
    },
};
</script>