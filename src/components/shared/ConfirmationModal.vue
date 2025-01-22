<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <!-- Título -->
            <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
            <!-- Mensaje -->
            <p class="text-gray-600 mb-6">{{ message }}</p>
            <!-- Botones -->
            <div class="flex justify-end gap-4">
                <button @click="cancelAction" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg">
                    {{ cancelText }}
                </button>
                <button @click="confirmAction" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true, // Controla si el modal está visible
        },
        title: {
            type: String,
            required: true, // Título del modal
        },
        message: {
            type: String,
            required: true, // Mensaje que se muestra
        },
        confirmText: {
            type: String,
            default: "Confirmar", // Texto del botón de confirmación
        },
        cancelText: {
            type: String,
            default: "Cancelar", // Texto del botón de cancelación
        },
    },
    methods: {
        cancelAction() {
            this.$emit("cancel"); // Emitir evento cuando se cancela
        },
        confirmAction() {
            this.$emit("confirm"); // Emitir evento cuando se confirma
        },
    },
};
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>