<template>
    <button class="bg-[var(--color-highland-400)] hover:bg-[var(--color-highland-700)] text-white font-bold py-2 px-4 rounded" @click="$emit('click')">
        {{ label }}
    </button>
</template>

<script>
export default {
    props: ["label"],
};
</script>