<template>
  <!-- Carrusel: ajustar la a altura 2/3 -->
  <div class="relative w-full h-screen bg-white">
    <div id="carousel" class="relative w-full h-full bg-green-100">
      <div class="relative w-full h-full overflow-hidden">
        <!-- Slides -->
        <div
          v-for="(item, index) in slides"
          :key="index"
          class="absolute inset-0 transition-opacity duration-1000"
          :class="{
            'opacity-100 z-10': currentSlide === index,
            'opacity-0 z-0': currentSlide !== index,
          }"
        >
          <!-- Imagen de fondo -->
          <div
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${item.image})` }"
          ></div>
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-40"></div>
          <!-- Contenido -->
          <div
            class="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white space-y-4"
          >
            <h1 class="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              {{ item.title }}
            </h1>
            <p class="text-lg md:text-xl drop-shadow-lg">
              {{ item.subtitle }}
            </p>
            <router-link
              to="/Catalogo"
              class="inline-block bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-300"
            >
              {{ item.buttonText }}
            </router-link>
          </div>
        </div>
      </div>
      <!-- Botones -->
      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full z-20"
      >
        &lt;
      </button>
      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full z-20"
      >
        &gt;
      </button>
      <!-- Indicadores -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        <button
          v-for="(item, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          :class="[
            'w-3 h-3 rounded-full',
            currentSlide === index ? 'bg-green-600' : 'bg-gray-300',
          ]"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSlide: 0,
      interval: null, // Intervalo para el desplazamiento automático
      slides: [
        {
          image: "/img/bg/back1.png",
          title: "Desde dentro de la naturaleza",
          subtitle: "Productos herbolarios y fórmulas magistrales",
          buttonText: "Ver Productos",
        },
        {
          image: "/img/bg/back2.png",
          title: "Calidad y Tradición",
          subtitle: "Descubre nuestras tinturas y microdosis",
          buttonText: "Explorar",
        },
      ],
    };
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    },
    prevSlide() {
      this.currentSlide =
        (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    },
    goToSlide(index) {
      this.currentSlide = index;
    },
    startAutoSlide() {
      this.interval = setInterval(() => {
        this.nextSlide();
      }, 6000); // Cambia cada 4 segundos
    },
    stopAutoSlide() {
      clearInterval(this.interval);
    },
  },
  mounted() {
    this.startAutoSlide(); // Inicia el desplazamiento automático
  },
  beforeDestroy() {
    this.stopAutoSlide(); // Limpia el intervalo al destruir el componente
  },
};
</script>

<style scoped>
/* Ajustes para el contenedor y los slides */
#carousel {
  font-family: "Inter", sans-serif;
}
</style>