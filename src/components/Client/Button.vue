<template>
    <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" @click="$emit('click')">
        {{ label }}
    </button>
</template>

<script>
export default {
    props: ["label"],
};
</script>