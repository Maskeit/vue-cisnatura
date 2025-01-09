<template>
    <div>
        <!-- Lista de direcciones -->
        <AddressList :addresses="addresses" @updateAddresses="fetchAddresses" />

        <!-- Mostrar formulario si hay menos de 3 direcciones -->
        <div v-if="addresses.length < 3">
            <AddressForm @addressSaved="fetchAddresses" />
        </div>

        <!-- Botón de continuar si hay al menos una dirección -->
        <div v-if="addresses.length > 0" class="my-4 text-center">
            <button @click="continueToCheckout" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Continuar
            </button>
        </div>
    </div>
</template>

<script>
import AddressList from '@/components/AddressList.vue';
import AddressForm from '@/components/AddressForm.vue';
import { UserAccountService } from "@/services/UserAccountService";

export default {
    components: {
        AddressList,
        AddressForm,
    },
    data() {
        return {
            addresses: [], // Lista de direcciones
        };
    },
    async mounted() {
        await this.fetchAddresses();
    },
    methods: {
        async fetchAddresses() {
            try {
                const response = await UserAccountService.getAllAddress();
                if (response) {
                    this.addresses = response; // Guardar las direcciones en el estado
                }
            } catch (error) {
                console.error("Error al obtener las direcciones:", error);
            }
        },
        continueToCheckout() {
            // Redirige al siguiente paso
            this.$router.push("/checkout");
        },
    },
};
</script>