<template>
    <div class="flex justify-between items-center mt-6">
        <button :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            @click="$emit('changePage', currentPage - 1)">
            Anterior
        </button>
        <p>Página {{ currentPage }} de {{ totalPages }}</p>
        <button :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            @click="$emit('changePage', currentPage + 1)">
            Siguiente
        </button>
    </div>
</template>

<script>
export default {
    props: {
        currentPage: { type: Number, required: true },
        totalPages: { type: Number, required: true },
    },
};
</script>