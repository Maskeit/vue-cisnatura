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

<script setup lang="ts">
// Definir propiedades con TypeScript
defineProps<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}>();

// Emitir eventos
const emit = defineEmits(["confirm", "cancel"]);

// Métodos para manejar acciones
const cancelAction = () => emit("cancel");
const confirmAction = () => emit("confirm");
</script>
