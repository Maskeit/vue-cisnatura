<template>
    <div class="max-w-4xl mx-auto my-5">
        <!-- Título -->
        <h2 class="text-2xl font-bold text-[var(--color-highland-600)] mb-6">Tus direcciones guardadas</h2>

        <!-- Lista de direcciones -->
        <div v-if="addresses.length > 0" class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="address in addresses" :key="address.id"
                class="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                <!-- Nombre -->
                <h3 class="text-lg font-bold text-gray-800 mb-2">
                    {{ address.fullName }}
                </h3>

                <!-- Dirección -->
                <p class="text-sm text-gray-600 mb-2">
                    <strong>Dirección:</strong> {{ address.calle }}, {{ address.colonia }}, {{ address.ciudad }}, {{
                        address.estado }}, CP: {{ address.postalcode }}
                </p>

                <!-- Teléfono -->
                <p class="text-sm text-gray-600 mb-2">
                    <strong>Teléfono:</strong> {{ address.telefono }}
                </p>

                <!-- RFC -->
                <p v-if="address.RFC" class="text-sm text-gray-600 mb-4">
                    <strong>RFC:</strong> {{ address.RFC }}
                </p>

                <!-- Botones -->
                <div class="flex justify-between items-center mt-4">
                    <label class="flex items-center space-x-2">
                        <input type="radio" :value="address.id" :checked="selectedAddressId === address.id"
                            @change="selectAddress(address.id)" />
                        <span class="text-gray-700">Seleccionar</span>
                    </label>
                    <button @click="openDeleteModal(address.id)"
                        class="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-red-600">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
        <!-- Modal de confirmación -->
        <ConfirmationModal v-if="isDeleteModalOpen" :isOpen="isDeleteModalOpen" title="¿Eliminar esta dirección?"
            message="Esta acción no se puede deshacer. ¿Deseas continuar?" confirmText="Eliminar" cancelText="Cancelar"
            @confirm="confirmDelete" @cancel="isDeleteModalOpen = false" />
        <!-- Mensaje cuando no hay direcciones -->
        <p v-if="addresses.length === 0" class="text-gray-600 mt-6">
            No tienes direcciones guardadas. Por favor, agrega una nueva dirección.
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Address } from "@/interfaces/Address";
import ConfirmationModal from "@/components/shared/ConfirmationModal.vue";


// Emitir eventos
const emit = defineEmits(["addressSelected", "delete-address"]);

// Estados reactivos
// estado del modal de confirmacion
const isDeleteModalOpen = ref(false);
const selectedAddressId = ref<number | null>(null);

const props = defineProps<{
    addresses: Address[]
}>();

// Computed para acceder a las direcciones desde el store
const addresses = computed(() => props.addresses);

// Método para seleccionar una dirección
const selectAddress = (id: number) => {
    emit("addressSelected", id);
};

const openDeleteModal = (id: number | string) => {
    selectedAddressId.value = Number(id);
    isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
    if (selectedAddressId.value) {
        emit("delete-address", Number(selectedAddressId.value));
    }
    isDeleteModalOpen.value = false;
};

</script>