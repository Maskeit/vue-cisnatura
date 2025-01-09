<template>
    <div class="max-w-4xl mx-auto my-5">
        <!-- Título -->
        <h2 class="text-2xl font-bold text-green-700 mb-6">Tus direcciones guardadas</h2>

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
                        <input type="radio" name="selectedAddress" :value="address.id" />
                        <span class="text-gray-700">Seleccionar</span>
                    </label>
                    <div class="flex space-x-2">
                        <button @click="deleteAddress(address.id)"
                            class="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-red-600">
                            Descartar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mensaje cuando no hay direcciones -->
        <p v-if="addresses.length === 0" class="text-gray-600 mt-6">
            No tienes direcciones guardadas. Por favor, agrega una nueva dirección.
        </p>
    </div>
</template>

<script>
import { UserAccountService } from "@/services/UserAccountService";

export default {
    props: {
        addresses: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        async deleteAddress(id) {
            if (confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
                try {
                    await UserAccountService.deleteAddress(id);
                    this.$emit("updateAddresses"); // Emitir evento para actualizar direcciones
                } catch (error) {
                    console.error("Error al eliminar la dirección:", error);
                }
            }
        },
    },
};
</script>