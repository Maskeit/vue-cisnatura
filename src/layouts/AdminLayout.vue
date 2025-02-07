<template>
    <div class="flex flex-col min-h-screen">
        <!-- <Navbar /> -->
        <Navbar :categories="categories" />
        <main class="flex-1 p-0">
            <router-view />
        </main>
        <Footer />
    </div>
</template>
<script setup lang="ts">
import Navbar from "@/components/Admin/Navbar.vue";
import Footer from "@/components/Admin/Footer.vue";

// Definimos la estructura de la categoría con TypeScript
interface Category {
  displayName: string;
  value: string | null;
}

// Lista de categorías
const categories: Category[] = [
  { displayName: "Todos los productos", value: null },
  { displayName: "Tinturas", value: "tintura" },
  { displayName: "Dióxido de cloro", value: "cds" },
  { displayName: "Cursos/Talleres", value: "curso" },
  { displayName: "Paquetes", value: "paquete" },
  { displayName: "Productos Naturales", value: "otro" },
];
</script>