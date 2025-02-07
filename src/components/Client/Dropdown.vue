<template>
    <div class="relative">
        <button @click="toggleDropdown" class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
            {{ buttonText }}
        </button>
        <div v-show="isOpen" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
        };
    },
    props: {
        buttonText: {
            type: String,
            default: "Menu",
        },
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
    },
};
</script>