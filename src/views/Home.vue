<template>
  <div class="flex flex-col">
    <!-- Componente Carrusel -->
    <div class="h-2/3">
      <Carousel />
    </div>
    <!-- Layout para productos destacados -->
    <div class="flex-grow">
      <HomeLayout />
    </div>
  </div>
</template>

<script>
import Carousel from "@/components/Carousel.vue";
import HomeLayout from "@/layouts/HomeLayout.vue";

export default {
  components: { Carousel, HomeLayout },
};
</script>