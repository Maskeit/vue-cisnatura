<template>
  <div class="p-6 bg-white shadow-md rounded-lg">
    <!-- Título -->
    <h2 class="text-2xl font-bold mb-4">Órdenes Recientes</h2>

    <!-- Barra de búsqueda -->
    <div class="flex justify-between items-center mb-4">
      <input type="text" placeholder="Buscar órdenes..." v-model="searchQuery"
        class="w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 text-sm text-left">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-6 py-3 border-b font-medium">ID</th>
            <th class="px-6 py-3 border-b font-medium">Subtotal</th>
            <th class="px-6 py-3 border-b font-medium">Envío</th>
            <th class="px-6 py-3 border-b font-medium">Total</th>
            <th class="px-6 py-3 border-b font-medium">Email</th>
            <th class="px-6 py-3 border-b font-medium">Estado</th>
            <th class="px-6 py-3 border-b font-medium">Fecha</th>
            <th class="px-6 py-3 border-b"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 cursor-pointer"
            @click="viewDetails(order.id)">
            <td class="px-6 py-3 border-b">{{ order.id }}</td>
            <td class="px-6 py-3 border-b">{{ order.subtotal }} MXN</td>
            <td class="px-6 py-3 border-b">{{ order.envio }} MXN</td>
            <td class="px-6 py-3 border-b">{{ order.total }} MXN</td>
            <td class="px-6 py-3 border-b">{{ order.customer_email }}</td>
            <td class="px-6 py-3 border-b">{{ translations.order_status[order.status] }}</td>
            <td class="px-6 py-3 border-b">{{ formatDate(order.updated_at) }}</td>
            <td class="px-6 py-3 border-b text-right">
              <button class="px-3 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                @click.stop="viewDetails(order.id)">
                Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-end items-center mt-4 space-x-2">
      <button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" :disabled="orderStore.currentPage === 1"
        @click="previousPage">
        Anterior
      </button>
      <span>Página {{ orderStore.currentPage }}</span>
      <button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        :disabled="orderStore.orders.length < orderStore.itemsPerPage" @click="nextPage">
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/components/Admin/stores/orderStore";
import { translations } from "@/utils/translations";
const router = useRouter();
const orderStore = useOrderStore();

const searchQuery = ref("");

// Obtener órdenes al montar el componente
onMounted(() => {
  if (orderStore.orders.length === 0 || orderStore.orders.length === 1) {
    orderStore.fetchOrders();
  }
});
window.addEventListener("beforeunload", () => {
  orderStore.$reset();
});
// Buscar órdenes
const filteredOrders = computed(() =>
  orderStore.filteredOrders(searchQuery.value)
);

// Navegar a los detalles de una orden
const viewDetails = (id: number) => {
  orderStore.selectOrder(id);
  router.push({ name: "OrderDetails", params: { id } });
};

// Paginación
const nextPage = () => {
  orderStore.fetchOrders(orderStore.currentPage + 1);
};

const previousPage = () => {
  if (orderStore.currentPage > 1) {
    orderStore.fetchOrders(orderStore.currentPage - 1);
  }
};

// Formatear fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>