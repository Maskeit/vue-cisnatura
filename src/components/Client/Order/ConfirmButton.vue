<template>
    <div class="flex justify-center">
        <button @click="confirm"
            class="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none">
            Confirmar y Pagar
        </button>
    </div>
</template>

<script>
export default {
    methods: {
        confirm() {
            this.$emit("confirm");
        },
    },
};
</script>