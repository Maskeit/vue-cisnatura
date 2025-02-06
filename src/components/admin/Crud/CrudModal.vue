<template>
    <!-- Se utiliza una transición para animar la aparición y desaparición del modal -->
    <transition name="fade">
        <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
            <!-- Contenedor del modal -->
            <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <!-- Botón para cerrar el modal -->
                <button @click="close"
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <!-- Aquí se inserta el contenido (por ejemplo, el formulario) mediante un slot -->
                <h1>¿Qué desea hacer con este usuario?</h1>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">

// Recibimos un prop para controlar la visibilidad del modal.
const props = defineProps<{
    visible: boolean;
}>();

// Definimos un evento para notificar al componente padre que se desea cerrar el modal.
const emit = defineEmits<{
    (e: 'cerrar'): void;
}>();

// Función para emitir el evento de cerrar.
function close() {
    emit('cerrar');
}
</script>

<style scoped>
/* Transición para la aparición/desaparición del modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>