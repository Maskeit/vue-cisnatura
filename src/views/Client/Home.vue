<template>
  <div class="home-content">
    <!-- Sección con Gradiente -->
    <section class="hero-section">
      <div class="text-center text-white py-16">
        <h1 class="text-4xl font-bold">Bienvenido a CISnatura</h1>
        <p class="text-lg mt-2">Descubre nuestros productos naturales</p>
        <router-link to="/Catalogo">
          <button class="mt-4 px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800 transition">
            Ver Catálogo
          </button>
        </router-link>
      </div>
    </section>

    <!-- Sección de Categorías -->
    <section class="categories-container">
      <h2 class="text-center text-2xl font-bold mb-6 hover:underline underline-offset-1">
        <router-link to="/Catalogo">Explora los tipos de productos</router-link>
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        <div v-for="category in categories" :key="category.id" class="category-card">
          <img :src="category.image" alt="icono" class="category-icon">
          <h3 class="text-lg font-bold">{{ category.name }}</h3>
          <router-link :to="category.link" class="category-link">Ver más</router-link>
        </div>
      </div>
    </section>

    <!-- Sección de Productos Destacados -->
    <section class="products-container">
      <h2 class="text-center text-2xl font-bold mb-6">Productos Destacados</h2>
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        <ProductCard v-for="product in products" :key="product.id" :product="product" @click="openModal(product)"
          @add-to-cart="handleAddToCart" />
      </div>
    </section>

    <!-- Modal de Producto -->
    <ProductModal :isOpen="isModalOpen" :product="selectedProduct" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProductCard from "@/components/shared/ProductCard.vue";
import ProductModal from "@/components/shared/ProductModal.vue";
import ProductService from "@/services/ProductService";
import { Products } from "@/interfaces/Products";

// Estado reactivo con tipado fuerte
const products = ref<Products[]>([]);
const isModalOpen = ref<boolean>(false);
const selectedProduct = ref<Products | null>(null);
const isLoading = ref<boolean>(true);

// Definimos una interfaz para las categorías
interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}

// Lista de categorías con `readonly` para evitar mutaciones accidentales
const categories: Readonly<Category[]> = [
  { id: 1, name: "Tinturas", image: "/img/Group1.svg", link: "/Catalogo?category=tintura" },
  { id: 2, name: "Naturales", image: "/img/Group3.svg", link: "/Catalogo?category=otro" },
  { id: 3, name: "Dióxido", image: "/img/Group2.svg", link: "/Catalogo?category=cds" },
  { id: 4, name: "Cursos", image: "/img/Group4.svg", link: "/Catalogo?category=curso" }
];

// Cargar productos al montar el componente
onMounted(fetchProducts);

async function fetchProducts(): Promise<void> {
  isLoading.value = true;
  try {
    products.value = await ProductService.getProducts();
  } catch (error) {
    console.error("Error al cargar productos:", error);
  } finally {
    isLoading.value = false;
  }
}

const openModal = (product: Products) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
};
</script>

<style scoped>
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

.category-link {
  display: block;
  margin-top: 8px;
  color: #799310;
  font-weight: bold;
}

.products-container {
  padding: 3rem 0;
}

h2 {
  color: #799310;
}
</style>