<template>
  <div class="p-0">
    <!-- Componente Carrusel -->
    <Carousel />
    <!-- Layout para productos destacados -->
    <HomeLayout />
  </div>
</template>

<script>
import Carousel from "@/components/Carousel.vue";
import HomeLayout from "@/layouts/HomeLayout.vue";

export default {
  components: { Carousel, HomeLayout },
};
</script>