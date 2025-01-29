<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Domicilios registrados</h1>

        <!-- Validación para mostrar si hay direcciones -->
        <div v-if="addresses.length === 0" class="text-gray-500">
            No tienes domicilios registrados.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="address in addresses" :key="address.id"
                class="border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                <h2 class="text-lg font-bold mb-2">{{ address.fullName }}</h2>
                <p>{{ address.colonia }}</p>
                <p>{{ address.calle }}</p>
                <p>{{ address.estado }}</p>
                <p>{{ address.ciudad }}</p>
                <p>{{ address.telefono }}</p>
                <p>{{ address.postalcode }}</p>
                <p>{{ address.RFC }}</p>
                <button 
                    class="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" 
                    @click="removeAddress(address.id)">
                    Quitar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useUserStore } from "@/services/stores/userStore";

const userStore = useUserStore();

// Enlace reactivo a las direcciones del store
const addresses = computed(() => userStore.address);

const removeAddress = async (id) => {
    try {
        const success = await userStore.deleteAddress(id);
        if (success) {
            console.log(`Dirección con ID ${id} eliminada correctamente.`);
        } else {
            console.error(`No se pudo eliminar la dirección con ID ${id}.`);
        }
    } catch (error) {
        console.error("Error al eliminar la dirección:", error);
    }
};

onMounted(async () => {
    try {
        await userStore.getAddress();
    } catch (error) {
        console.error("Error al cargar las direcciones:", error);
    }
});
</script>