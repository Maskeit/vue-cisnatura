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

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAddressStore } from "@/services/stores/addressStore";

const addressStore = useAddressStore();

onMounted(async () => {
  await addressStore.fetchAddresses(); // ✅ Carga direcciones solo si es necesario
});

const addresses = computed(() => addressStore.addresses);

const removeAddress = async (id: number) => {
  await addressStore.removeAddress(id);
};
</script>