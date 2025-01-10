<template>
    <div>
        <!-- Lista de direcciones -->
        <AddressList :addresses="addresses" @addressSelected="setSelectedAddress" @updateAddresses="updateAddresses"
            @showAddressForm="showForm = true" />

        <!-- Mostrar formulario si hay menos de 3 direcciones -->
        <div v-if="addresses.length < 3">
            <AddressForm @addressSaved="handleAddressSaved" />
        </div>
        <!-- Botón de continuar, solo si hay un domicilio seleccionado -->
        <div v-if="selectedAddress" class="my-4 text-center">
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
            showForm: false,
            addresses: [], // Lista de direcciones
            selectedAddress: null, // ID de la dirección seleccionada
        };
    },
    async mounted() {
        await this.fetchAddresses();
    },
    methods: {
        setSelectedAddress(id) {
            this.selectedAddress = id; // Actualiza el ID seleccionado
        },
        async fetchAddresses() {
            // Recupera la lista de direcciones del servidor
            const response = await UserAccountService.getAllAddress();
            if (response) {
                this.addresses = response; // Guardar direcciones en el estado local
            }
        },
        updateAddresses(newAddresses) {
            if (!newAddresses.find(address => address.id === this.selectedAddress)) {
                this.selectedAddress = null; // Limpia si la dirección seleccionada fue eliminada
            }
            this.addresses = newAddresses;
        },
        handleAddressSaved() {
            // Este evento se emite cuando se guarda una dirección
            this.fetchAddresses(); // Recargar direcciones
        },
        continueToCheckout() {
            localStorage.setItem("selectedAddressId", this.selectedAddress);
            this.$router.push("/ConfirmOrder");
        },
    },
};
</script>