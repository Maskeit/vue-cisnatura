<template>
  <div id="app" class="font-sans">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <div class="content">
      <router-view></router-view>
    </div>

    <!-- Footer -->
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
.content{
  min-height: 100dvh;
}

</style>