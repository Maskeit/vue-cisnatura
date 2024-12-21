<template>
    <div id="carousel" class="relative w-full">
        <!-- Contenedor con relación de aspecto 16:9 -->
        <div class="relative overflow-hidden aspect-w-16 aspect-h-9">
            <!-- Slides -->
            <div class="flex transition-transform duration-700 w-full"
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div v-for="(item, index) in slides" :key="index" class="w-full flex-shrink-0 h-full relative">
                    <!-- Imagen de fondo -->
                    <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${item.image})` }">
                    </div>
                    <!-- Logo -->
                    <img v-if="item.logo" :src="item.logo" alt="CISnatura Logo"
                        class="relative z-10 mx-auto mt-16 w-4/6" />
                </div>
            </div>
        </div>

        <!-- Botones -->
        <button @click="prevSlide"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            &lt;
        </button>
        <button @click="nextSlide"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            &gt;
        </button>

        <!-- Indicadores -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button v-for="(item, index) in slides" :key="index" @click="goToSlide(index)" :class="[
                'w-3 h-3 rounded-full',
                currentSlide === index ? 'bg-green-600' : 'bg-gray-300',
            ]"></button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentSlide: 0,
            slides: [
                {
                    image: "/public/img/bg/back1.png",
                    logo: "/public/img/bg/letters.svg",
                },
                {
                    image: "/public/img/bg/back2.png",
                    logo: "/public/img/bg/letters2.svg",
                },
            ],
        };
    },
    methods: {
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        },
        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        },
        goToSlide(index) {
            this.currentSlide = index;
        },
    },
};
</script>