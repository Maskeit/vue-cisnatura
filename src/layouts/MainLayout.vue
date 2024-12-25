<template>
    <div class="main-layout">
      <Navbar />
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