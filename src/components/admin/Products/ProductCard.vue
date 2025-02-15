<template>
    <div @click="$emit('click', product)"
        class="product-card bg-white w-56 shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
        :class="{ 'opacity-50': !product.active }"
        data-product-id="product.id">
        
        <!-- Imagen -->
        <div class="w-full bg-white">
            <img :src="`${V_Global_IMG}${product.thumb}`" :alt="product.product_name"
                class="w-500 h-500 object-cover mx-auto" />
        </div>

        <!-- Información del Producto -->
        <div class="p-4">
            <h3 class="text-lg font-bold text-center text-gray-800 line-clamp-1">
                {{ product.product_name }}
            </h3>
            <p class="text-gray-600 text-sm text-center mt-2 line-clamp-1" :title="product.description"
                v-html="product.description"></p>
        </div>

        <!-- Footer con Estado del Producto -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div>
                <!-- Ícono de estado -->
                <span class="inline-block text-lg">
                    <EyeIcon v-if="product.active === 1" class="h-6 w-6 text-green-600" />
                    <EyeSlashIcon v-else class="h-6 w-6 text-gray-400" />
                </span>
            </div>
            <button @click.stop="$emit('click', product)"
                class="bg-[var(--color-highland-400)] hover:bg-[var(--color-highland-700)] cursor-pointer text-white rounded-sm text-sm py-2 px-4">
                Modificar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { V_Global_IMG } from "@/services/system";
import { EventBus } from "@/services/eventBus";

// Props
const props = defineProps({
    product: { type: Object, required: true },
});

// Estado Reactivo del Producto
const productActive = ref(props.product.active);

// Escuchar el evento global para actualizar la UI
onMounted(() => {
    EventBus.on("updateProductState", ({ productId, active }) => {
        if (props.product.id === productId) {
            productActive.value = active;
        }
    });
});
</script>
<style scoped>
/* Estilo adicional si se necesita */
@media (width<500px) {
    .product-card {
        min-width: calc(100% - 2rem);
    }
}

.product-card img {
    width: 100%;
    height: 100%;
    max-width: 500px;
    /* Tamaño máximo */
    max-height: 500px;
    /* Tamaño máximo */
    object-fit: cover;
    /* Cubre el contenedor sin deformarse */
    object-position: center;
    /* Centra la imagen si tiene dimensiones diferentes */
}
</style>