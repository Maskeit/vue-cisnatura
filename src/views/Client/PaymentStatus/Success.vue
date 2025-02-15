<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 class="text-4xl font-bold text-green-600">Pago Exitoso</h1>
        <p class="mt-4 text-lg text-gray-700">Gracias por tu compra. Tu pedido está siendo procesado.</p>
        <p class="text-lg text-gray-700">En el historial de pedidos de tu cuenta puedes ver el estado de tu orden.</p>
        <router-link to="/" class="mt-6">
            <button class="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded shadow">
                Regresar a la tienda
            </button>
        </router-link>
    </div>
</template>

<script setup>
</script>