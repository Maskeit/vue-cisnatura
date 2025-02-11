<template>
    <div v-if="address && Object.keys(address).length" class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg font-semibold text-gray-800">Domicilio de envío</h2>
        <p class="text-gray-600 mt-2">
            {{ address.fullName }} <br />
            {{ address.calle }}, {{ address.colonia }} <br />
            {{ address.ciudad }}, {{ address.estado }}, C.P. {{ address.postalcode }} <br />
            Tel: {{ address.telefono }}
        </p>
    </div>
    <div v-else class="bg-red-100 text-red-800 p-4 rounded-lg">
        No se encontró la dirección de envío.
    </div>
</template>

<script setup lang="ts">
import type { Address } from "@/interfaces/Address";

// Definir las propiedades con TypeScript
defineProps<{
    address: Address | null;
}>();
</script>