<template>
  <div class="flex flex-col sm:flex-row">
    <!-- Sidebar -->
    <Sidebar :categories="categories" @filterCategory="filterByCategory" class="bg-gray-100" />

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <!-- Loader de carga -->
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
      </div>

      <!-- Productos -->
      <div class="product-list">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
          @click="openModal(product)" />
      </div>

      <!-- Modal -->
      <ProductModal v-if="isModalOpen" :isOpen="isModalOpen" :product="selectedProduct" @close="closeModal" />

      <!-- Paginación -->
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/shared/Sidebar.vue";
import ProductCard from "@/components/shared/ProductCard.vue";
import ProductModal from "@/components/shared/ProductModal.vue";
import Pagination from "@/components/shared/Pagination.vue";
import { useCatalog } from "@/composables/useCatalog";
import { useSearch } from "@/composables/useSearch";

// Hooks personalizados
const { 
  products, 
  filteredProducts, 
  selectedProduct, 
  isLoading, 
  isModalOpen, 
  currentPage, 
  totalPages, 
  fetchProducts, 
  openModal, 
  closeModal, 
  changePage, 
  filterByCategory 
} = useCatalog();

const { categories } = useSearch();

const route = useRoute();

// Cargar productos al montar
onMounted(async () => {
  await fetchProducts();
});
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  margin: 0 auto;
}
</style>