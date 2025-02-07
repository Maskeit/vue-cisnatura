<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-red-500 mb-4">Error {{ errorCode }}</h1>
      <p class="text-xl text-gray-700">{{ errorMessage }}</p>
      <router-link to="/"
        class="mt-6 inline-block px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600">
        Volver al inicio
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorCode: {
      type: [Number, String],
      default: 404
    },
    errorMessage: {
      type: String,
      default: "Página no encontrada"
    }
  }
};
</script>