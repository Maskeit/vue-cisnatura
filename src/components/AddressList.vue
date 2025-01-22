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
                        <input type="radio" :value="address.id" :checked="selectedId === address.id"
                            @change="selectAddress(address.id)" />
                        <span class="text-gray-700">Seleccionar</span>
                    </label>
                    <button @click="deleteAddress(address.id)" :disabled="isDeleting === address.id"
                        class="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-red-600">
                        <span v-if="isDeleting !== address.id">Descartar</span>
                        <span v-else class="flex items-center justify-center">
                            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                            Eliminando...
                        </span>
                    </button>
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
    data() {
        return {
            isDeleting: null,
            localAddresses: [...this.addresses], // copia local de las direcciones
            selectedId: null,
        }
    },
    watch: {
        addresses: {
            inmediate: true,
            handler(newVal) {
                this.localAddresses = [...newVal];
            }
        }
    },
    props: {
        addresses: {
            type: Array,
            default: () => [],
        },
        value: {
            type: String, // para almacenar id seleccionado
            default: null,
        }
    },
    methods: {
        selectAddress(id) {
            this.selectedId = id; // Actualiza el ID seleccionado localmente
            this.$emit("addressSelected", id); // Emite evento al padre
        },
        async deleteAddress(id) {
            if (confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
                this.isDeleting = id; // Activa el loader para este ID
                try {
                    // Realizar la solicitud al servidor
                    const response = await UserAccountService.deleteAddress(id);

                    if (response === 200) {
                        // Eliminar del arreglo local
                        this.localAddresses = this.localAddresses.filter((address) => address.id !== id);

                        // Emitir evento para sincronizar con el padre
                        this.$emit("updateAddresses", this.localAddresses);
                        // Limpia la selección si el domicilio eliminado estaba seleccionado
                        if (this.selectedId === id) {
                            this.selectedId = null;
                            this.$emit("addressSelected", null);
                        }
                        // Si hay menos de 3 direcciones, emitir evento para mostrar el formulario
                        if (this.localAddresses.length < 3) {
                            this.$emit("showAddressForm");
                        }
                    } else {
                        console.error("No se pudo eliminar el domicilio en el servidor.");
                    }
                } catch (error) {
                    console.error("Error al eliminar el domicilio:", error);
                } finally {
                    this.isDeleting = null; // Desactivar el loader
                }
            }
        },
    },
};
</script>