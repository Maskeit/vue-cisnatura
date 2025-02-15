<template>
    <div class="flex justify-center">
        <button @click="confirm"
            class="bg-green-500 mb-3 cursor-pointer text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none">
            Confirmar y Pagar
        </button>
    </div>
</template>

<script setup lang="ts">
// Define eventos emitidos
const emit = defineEmits(["confirm"]);

// Función para emitir el evento
const confirm = (): void => {
    emit("confirm");
};
</script>