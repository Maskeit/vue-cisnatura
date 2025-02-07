<template>
    <div>
        <!-- Sidebar para pantallas grandes -->
        <div class="hidden sm:block bg-gray-100 p-4 h-full">
            <h2 class="text-green-600 font-bold">Categorías</h2>
            <ul class="space-y-4 mt-4">
                <li v-for="category in categories" :key="category.value"
                    @click="$emit('filterCategory', category.value)" class="hover:text-green-600 cursor-pointer">
                    {{ category.displayName }}
                </li>
            </ul>
        </div>

        <!-- Select para móviles -->
        <div class="block sm:hidden">
            <select @change="$emit('filterCategory', $event.target.value)"
                class="w-full border border-gray-300 rounded p-2">
                <option v-for="category in categories" :key="category.value"@click="$emit('filterCategory', category.value)">
                    {{ category.displayName }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        categories: {
            type: Array,
            required: true,
        },
    },
};
</script>