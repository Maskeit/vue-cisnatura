<template>
    <div class="main-layout">
      <!-- <Navbar /> -->
      <Navbar :categories="categories" />
      <main>
        <router-view />
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Navbar from "@/components/Navbar.vue";
  import Footer from "@/components/Footer.vue";
  
  export default {
    components: {
      Navbar,
      Footer,
    },
    data() {
      return {
        categories: [
          { displayName: "Todos los productos", value: null },
          { displayName: "Tinturas", value: "tintura" },
          { displayName: "Dióxido de cloro", value: "cds" },
          { displayName: "Cursos/Talleres", value: "curso" },
          { displayName: "Paquetes", value: "paquete" },
          { displayName: "Productos Naturales", value: "otro" },
        ],
      };
    },
  };
  </script>
  
  <style>
  .main-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1; /* Asegura que el contenido principal ocupe el espacio disponible */
  }
  </style>