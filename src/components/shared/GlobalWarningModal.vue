<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black/50 backdrop-opacity-80 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <p class="mb-4">{{ message }}</p>
            <div class="flex justify-center gap-4">
                <button @click="onConfirm" class="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600">
                    {{ confirmText }}
                </button>
                <button @click="onCancel" class="bg-gray-300 cursor-pointer text-black px-4 py-2 rounded hover:bg-gray-400">
                    {{ cancelText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isVisible: {
            type: Boolean,
            required: true,
        },
        message: {
            type: String,
            default: "¿Está seguro?",
        },
        confirmText: {
            type: String,
            default: "Confirmar",
        },
        cancelText: {
            type: String,
            default: "Cancelar",
        },
    },
    emits: ["confirm", "cancel"],
    methods: {
        onConfirm() {
            this.$emit("confirm");
        },
        onCancel() {
            this.$emit("cancel");
        },
    },
};
</script>

<style scoped>
/* Personaliza los estilos si es necesario */
</style>