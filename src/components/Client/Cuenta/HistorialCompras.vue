<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Historial de Compras</h1>

        <!-- Validación para mostrar si hay órdenes -->
        <div v-if="userStore.orders.length === 0" class="text-gray-500">
            No hay órdenes registradas.
        </div>

        <!-- Cards para mostrar las órdenes -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="order in userStore.orders" :key="order.id"
                class="border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                <h2 class="text-lg font-bold mb-2">Orden #{{ order.payment_intent_id }}</h2>
                <p><strong>Fecha:</strong> {{ formatDate(order.updated_at) }}</p>
                <p><strong>Total:</strong> ${{ order.total }}</p>
                <p>
                    <strong>Estado: </strong>
                    <span class="capitalize">
                        {{ translate("order_status", order.order_status) }}
                    </span>
                </p>
                <p>
                    <strong>Envío: </strong>
                    <span class="capitalize">
                        {{ translate("shippment_status", order.envio_status) || "Sin confirmar"}} 
                    </span>
                </p>
                <button class="mt-4 w-full bg-[var(--color-highland-500)] text-white px-4 py-2 rounded hover:bg-[var(--color-highland-800)] transition"
                    @click="showOrderDetails(order)">
                    Ver Detalles
                </button>
            </div>
        </div>

        <!-- Modal para mostrar los detalles de la orden -->
        <div v-if="selectedOrder" class="fixed inset-0 bg-black/50 backdrop-opacity-80 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg lg:w-1/2">
                <h2 class="text-xl font-bold mb-4">
                    Detalles de la Orden #{{ selectedOrder.id }}
                </h2>
                <p><strong>Total:</strong> ${{ selectedOrder.total }}</p>
                <p><strong>Estado:</strong> {{ translate("order_status", selectedOrder.order_status) }}</p>
                <p><strong>Envío:</strong> {{ translate("shippment_status", selectedOrder.envio_status) || "Sin Confirmar"}}</p>
                <p><strong>Productos:</strong></p>
                <ul v-if="selectedOrder.productsData && selectedOrder.productsData.length" class="list-disc ml-5">
                    <li v-for="product in selectedOrder.productsData" :key="product.id">
                        {{ product.name }} - Cantidad: {{ product.quantity }}
                    </li>
                </ul>
                <p v-else>No hay productos en esta orden.</p>
                <button class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" @click="closeModal">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/services/stores/userStore";
import { translate } from "@/utils/translations";
import type { ProductOrder } from "@/interfaces/ProductOrder";

// Instancia del store
const userStore = useUserStore();

// Estado reactivo para la orden seleccionada
const selectedOrder = ref < ProductOrder | null > (null);

// Función para mostrar los detalles de la orden en el modal
const showOrderDetails = (order: ProductOrder): void => {
    selectedOrder.value = order;
};

// Función para cerrar el modal
const closeModal = (): void => {
    selectedOrder.value = null;
};

// Función para formatear la fecha correctamente
const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
};

// Cargar el historial de compras al montar el componente
onMounted(async () => {
    try {
        await userStore.getHistory();
    } catch (error) {
        console.error("Error al cargar el historial de órdenes:", error);
    }
});
</script>