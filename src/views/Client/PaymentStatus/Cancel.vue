<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 class="text-4xl font-bold text-red-600">Pago Cancelado</h1>
        <p class="mt-4 text-lg text-gray-700">Tu pago no ha sido completado o ha sido cancelado. Si necesitas ayuda, por favor contáctanos.</p>
        <router-link to="/" class="mt-6">
            <button class="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded shadow">
                Regresar a la tienda
            </button>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "CancelPage",
};
</script>