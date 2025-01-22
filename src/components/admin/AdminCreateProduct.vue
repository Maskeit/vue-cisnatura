<template>
    <div
      class="product-card flex flex-col items-center justify-center bg-gray-200 w-56 h-80 shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
      @click="openCreateModal"
    >
      <!-- Ícono y texto -->
      <div class="flex flex-col items-center">
        <div class="bg-green-700 text-white rounded-full h-16 w-16 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-8 w-8">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p class="text-lg font-medium text-gray-700 mt-4">Agregar Producto</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminCreateProductCard",
    methods: {
      openCreateModal() {
        this.$emit("open-create-modal");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Personaliza si es necesario */
  </style>