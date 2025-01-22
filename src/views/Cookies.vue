<template>
    <div class="cookies-page bg-gray-50 min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div class="max-w-3xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Aviso de Cookies</h1>
        <p class="text-gray-700 mb-4 text-lg font-semibold text-center">
          Usamos cookies para mejorar tu experiencia en nuestro sitio web.
        </p>
        <p class="text-gray-600 mb-6">
          Al continuar navegando, aceptas el uso de cookies. Las cookies nos permiten personalizar el contenido
          y los anuncios de nuestra propia página, ofrecer funciones de redes sociales y analizar el tráfico de nuestro sitio web.
        </p>
        <p class="text-gray-800 font-semibold mb-4">Tipos de cookies que utilizamos:</p>
        <ul class="list-disc pl-6 space-y-4">
          <li class="text-gray-600">
            <strong class="text-gray-800">Cookies necesarias:</strong> Estas cookies son esenciales para que el sitio web funcione correctamente.
            Permiten el uso de funciones básicas como la navegación por la página y el acceso a áreas seguras.
          </li>
          <li class="text-gray-600">
            <strong class="text-gray-800">Cookies de rendimiento:</strong> Nos permiten contar visitas y fuentes de tráfico para medir
            y mejorar el rendimiento de nuestro sitio.
          </li>
          <li class="text-gray-600">
            <strong class="text-gray-800">Cookies de funcionalidad:</strong> Permiten que el sitio web proporcione una funcionalidad mejorada
            y personalización según tus interacciones previas.
          </li>
          <li class="text-gray-600">
            <strong class="text-gray-800">Cookies de publicidad:</strong> Estas cookies se utilizan para manejar las sesiones de usuario.
          </li>
        </ul>
        <div class="text-center mt-8">
          <router-link
            to="/"
            class="inline-block bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Cookies",
  };
  </script>
  
  <style scoped>
  /* Añadir estilos personalizados si es necesario */
  </style>