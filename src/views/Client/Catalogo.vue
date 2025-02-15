<template>
  <!-- Sección con Gradiente -->
  <section class="hero-section">
    <div class="text-center text-white py-16">
      <h1 class="text-4xl font-bold">Bienvenido a CISnatura</h1>
      <p class="text-lg mt-2">Descubre nuestros productos naturales</p>
    </div>
  </section>
  <!-- Sección de Categorías -->
  <section class="categories-container">
    <h2 class="text-center text-[var(--color-highland-600)] text-2xl font-bold mb-6 hover:underline underline-offset-1">
      Explora los tipos de productos
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 cursor-pointer">
      <div v-for="category in categorias" :key="category.id" class="category-card">
        <img :src="category.image" alt="icono" class="category-icon">
        <h3 class="text-lg text-[var(--color-highland-700)] font-bold">{{ category.name }}</h3>
      </div>
    </div>
  </section>

  <div class="flex flex-col sm:flex-row">
    <!-- Sidebar -->
    <Sidebar :categories="searchStore.categories" @filterCategory="filterByCategory" class="bg-gray-100" />

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <!-- Loader de carga -->
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
      </div>

      <!-- Lista de Productos -->
      <div class="product-list">
        <ProductCard v-for="product in displayedProducts" 
          :key="product.id" 
          :product="product"
          :ref="setProductRef"
          @click="productStore.openModal(product)" />
      </div>
      <!-- Modal -->
      <ProductModal v-if="productStore.isModalOpen" :isOpen="productStore.isModalOpen"
        :product="productStore.selectedProduct" @close="productStore.closeModal" />
      <!-- Paginación -->
      <Pagination :currentPage="productStore.currentPage" :totalPages="productStore.totalPages"
        @changePage="productStore.changePage" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, computed, onUnmounted, watch, nextTick } from "vue";
import Sidebar from "@/components/shared/Sidebar.vue";
import ProductCard from "@/components/shared/ProductCard.vue";
import ProductModal from "@/components/shared/ProductModal.vue";
import Pagination from "@/components/shared/Pagination.vue";
import { useProductsStore } from "@/services/stores/productStore";
import { useCatalog } from "@/composables/useCatalog";
import { useSearchStore } from "@/services/stores/searchStore.ts";
// Estado global de productos
const productStore = useProductsStore();
const { filteredProducts, filterByCategory } = useCatalog();
const searchStore = useSearchStore()
// Determinar si estamos en modo búsqueda
const isSearching = computed(() => searchStore.searchResults.length > 0);

// Definimos una interfaz para las categorías
interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}
// Mostrar productos filtrados por búsqueda o por categoría
const displayedProducts = computed(() => {
    return isSearching.value ? searchStore.searchResults : filteredProducts.value;
});

onUnmounted(() => {
    searchStore.clearSearch();
});
// Lista de categorías con `readonly` para evitar mutaciones accidentales
const categorias: Readonly<Category[]> = [
  { id: 1, name: "Tinturas", image: "/img/Group1.svg", link: "/Catalogo?category=tintura" },
  { id: 2, name: "Naturales", image: "/img/Group3.svg", link: "/Catalogo?category=otro" },
  { id: 3, name: "Dióxido", image: "/img/Group2.svg", link: "/Catalogo?category=cds" },
  { id: 4, name: "Cursos", image: "/img/Group4.svg", link: "/Catalogo?category=curso" }
];
// Hooks personalizados
const {
  isLoading,
  isModalOpen,
  openModal,
  closeModal,
} = useCatalog();

// Cargar productos al montar (ahora directamente desde el store)
onMounted(() => {
  productStore.fetchProducts();
});


const productListContainer = ref<HTMLElement | null>(null);
const productRefs = ref<{ [key: number]: HTMLElement | null }>({});

/**
 * Función para hacer scroll suave al producto seleccionado
 */
const scrollToProduct = (productId: number) => {
  nextTick(() => {
    const productElement = productRefs.value[productId];
    if (productElement && productElement.scrollIntoView) {
      productElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};
const setProductRef = (el: any) => {
  if (el && el.$el) {
    productRefs.value[el.$props.product.id] = el.$el;
  }
};
// Escuchar cambios en la búsqueda para hacer scroll cuando se seleccione un producto
watch(() => searchStore.searchResults, (newResults) => {
  if (newResults.length === 1) {
    scrollToProduct(newResults[0].id);
  }
});
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  margin: 0 auto;
}

/* Gradiente de fondo */
.hero-section {
  background: linear-gradient(to bottom, #576b08, #7c9710, #e2e2e2, #fff);
  text-align: center;
  padding: 4rem 0;
  color: white;
}

/* Sección de categorías */
.categories-container {
  background-color: #fff;
  padding: 3rem 0;
}

.category-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  transform: scale(1.05);
}

.category-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
}
</style>