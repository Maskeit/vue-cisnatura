<template>
  <Navbar :categories="categories" />
  <div class="cuenta-layout">
    <SidebarCuenta />
    <main>
      <router-view />
    </main>
  </div>
  <Footer/>
</template>

<script setup lang="js">
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import SidebarCuenta from '@/components/Cuenta/SidebarCuenta.vue';
</script>

<style scoped>
.cuenta-layout {
  display: flex;
  min-height: 100vh;
}

</style>