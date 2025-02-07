<template>
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-gray-50 shadow rounded-lg">
        <!-- Imagen -->
        <div class="w-full md:w-1/2 mb-6 md:mb-0">
            <img src="/src/assets/inc/plc2.webp" alt="Blog de CISnatura" class="rounded-lg shadow-lg w-full h-auto" />
        </div>

        <!-- Información -->
        <div class="w-full md:w-1/2 md:pl-8 text-center md:text-left">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Aprende más</h2>
            <p class="text-gray-600 text-lg mb-6">
                Visita la página principal <a href="https://www.cisnatura.com" target="_blank"
                    class="text-blue-500 underline">www.cisnatura.com</a> y mantente informado acerca de los mejores
                remedios herbolarios.
            </p>
            <a href="https://www.cisnatura.com" target="_blank"
                class="inline-block bg-green-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                Ver página principal
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomeIndicates",
};
</script>

<style scoped>
/* Personaliza estilos adicionales si es necesario */
</style>