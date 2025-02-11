<template>
    <div v-if="order" class="p-6 bg-white shadow-md rounded-lg">
        <h2 class="text-2xl font-bold mb-6">Detalles de la Orden #{{ order.id }}</h2>
        <div class="grid grid-cols-2 gap-6">
            <!-- Columna 1: Información de la Orden -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Información de la Orden</h3>
                <p><strong>ID:</strong> {{ order.id }}</p>
                <p><strong>Subtotal:</strong> {{ order.subtotal }} MXN</p>
                <p><strong>Envío:</strong> {{ order.envio }} MXN</p>
                <p><strong>Total:</strong> {{ order.total }} MXN</p>
                <p><strong>Estado:</strong> {{ order.order_status }}</p>
                <p><strong>Estado del pago:</strong> {{ order.payment_status }}</p>
                <p><strong>Fecha de Creación:</strong> {{ formatDate(order.created_at) }}</p>
                <h4 class="text-md font-bold mt-6">Productos:</h4>
                <ul class="list-disc pl-5">
                    <li v-for="product in order.productsData" :key="product.productId">
                        {{ product.name }} - Cantidad: {{ product.quantity }}
                    </li>
                </ul>
            </div>
            
            <!-- Columna 2: Domicilio -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Domicilio de Envío</h3>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Nombre:</strong> {{ order.address_id[0].fullName }}</p>
                    <button @click="copyToClipboard(order.address_id[0].fullName)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Calle:</strong> {{ order.address_id[0].calle }}</p>
                    <button @click="copyToClipboard(order.address_id[0].calle)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Ciudad:</strong> {{ order.address_id[0].ciudad }}</p>
                    <button @click="copyToClipboard(order.address_id[0].ciudad)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Estado:</strong> {{ order.address_id[0].estado }}</p>
                    <button @click="copyToClipboard(order.address_id[0].estado)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Colonia:</strong> {{ order.address_id[0].colonia }}</p>
                    <button @click="copyToClipboard(order.address_id[0].colonia)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Código Postal:</strong> {{ order.address_id[0].postalcode }}</p>
                    <button @click="copyToClipboard(order.address_id[0].postalcode)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Teléfono:</strong> {{ order.address_id[0].telefono }}</p>
                    <button @click="copyToClipboard(order.address_id[0].telefono)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center mb-2 gap-3">
                    <p><strong>Email del cliente:</strong> {{ order.customer_email }}</p>
                    <button @click="copyToClipboard(order.customer_email)"
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2  dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Copiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Botones de acciones -->
        <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Cambiar Estado</h3>
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado de la Orden:</label>
                <select v-model="orderStatus"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="complete">Completo</option>
                    <option value="pending">Pendiente</option>
                    <option value="accepted">Aceptado</option>
                    <option value="canceled">Cancelado</option>
                </select>
                <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                    @click="updateOrderStatus">
                    Guardar Estado de la Orden
                </button>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado de Envío:</label>
                <select v-model="shippingStatus"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="delivered">Entregado</option>
                    <option value="in_process">En Proceso</option>
                    <option value="in_transit">En Tránsito</option>
                    <option value="returned">Devuelto</option>
                </select>
                <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                    @click="updateShippingStatus">
                    Guardar Estado de Envío
                </button>
            </div>

            <button class="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
                @click="notifyShipment">
                Notificar de Enviado
            </button>
        </div>

        <div class="mt-8">
            <button class="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600" @click="goBack">
                Regresar
            </button>
        </div>
    </div>
    <!-- Mensaje de carga o error -->
    <div v-else class="p-6 text-center">
        <p class="text-gray-500">Cargando datos de la orden...</p>
    </div>
    <!-- modal de confirmacion -->
    <ConfirmationModal v-if="isConfirmationModalOpen" :isOpen="isConfirmationModalOpen" :title="'Respuesta'"
        :message="confirmationMessage" confirmText="Aceptar" @confirm="closeConfirmationModal" />

</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useOrderStore } from "@/services/stores/orderStore";
import { ref, onMounted, computed } from "vue";
import ConfirmationModal from "@/components/shared/ConfirmationModal.vue";
import Operations from "@/services/AdminServices/Operations";
import type { ProductOrder } from "@/interfaces/ProductOrder";

// Instancias de Vue Router y Store
const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();

// Obtener ID de la orden desde la ruta
const orderId = computed(() => Number(route.params.id));

// Estado reactivo para la orden
const order = ref<ProductOrder | null>(null);

// Estado para los selectores de estado
const orderStatus = ref<string>("");
const shippingStatus = ref<string>("");

// Estado del modal de confirmación
const isConfirmationModalOpen = ref<boolean>(false);
const confirmationMessage = ref<string>("");

// Cargar la orden desde el store o desde la API
const loadOrder = async () => {
    try {
        order.value = orderStore.getOrderById(orderId.value);
        if (!order.value) {
            await orderStore.fetchOrderById(orderId.value);
            order.value = orderStore.getOrderById(orderId.value);
            if (!order.value) {
                console.error("No se pudo cargar la orden ni desde el estado ni desde el backend.");
                return;
            }
        }
        orderStatus.value = order.value.order_status;
        shippingStatus.value = order.value.shippingCost ? "in_process" : "pending"; // Valor inicial de estado de envío
    } catch (error) {
        console.error("Error al cargar la orden:", error);
    }
};

// Llamar `loadOrder` al montar el componente
onMounted(loadOrder);

// Mostrar modal de confirmación
const openConfirmationModal = (message: string) => {
    confirmationMessage.value = message;
    isConfirmationModalOpen.value = true;
};

const closeConfirmationModal = () => {
    isConfirmationModalOpen.value = false;
};

// Actualizar estado de la orden
const updateOrderStatus = async () => {
    try {
        const response = await Operations.updateOrder(orderId.value, orderStatus.value, "false");
        if (response === 200) {
            openConfirmationModal("El estado de la orden se actualizó correctamente.");
        } else {
            console.error("Error al actualizar el estado de la orden.");
        }
    } catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
    }
};

// Actualizar estado de envío
const updateShippingStatus = async () => {
    try {
        const response = await Operations.updateOrder(orderId.value, shippingStatus.value, "true");
        if (response === 200) {
            openConfirmationModal("El estado de la orden se actualizó correctamente.");
        } else {
            openConfirmationModal("Error al actualizar el estado de envío.");
        }
    } catch (error) {
        console.error("Error al actualizar el estado de envío:", error);
    }
};

// Notificar de envío
const notifyShipment = () => {
    console.log("Notificación enviada para la orden:", orderId.value);
};

// Navegar atrás
const goBack = () => {
    router.push({ name: "RecentOrder" });
};

// Formatear fecha
const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Copiar texto al portapapeles
const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};
</script>