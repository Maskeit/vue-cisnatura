<template>
    <!-- Loader mientras se obtienen los domicilios -->
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>
    <!-- Contenido principal -->
    <div v-else>
        <!-- Lista de direcciones -->
        <AddressList :addresses="addresses" @addressSelected="setSelectedAddress" @updateAddresses="updateAddresses"
            @showAddressForm="showForm = true" />
        <!-- Botón de continuar, solo si hay un domicilio seleccionado -->
        <div v-if="selectedAddress" class="my-4 text-center">
            <button @click="continueToCheckout" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Continuar
            </button>
        </div>
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
            isLoading: false,
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
            this.isLoading = true; // Activa el loader
            try {
                // Recupera la lista de direcciones del servidor
                const response = await UserAccountService.getAllAddress();
                if (response) {
                    this.addresses = response; // Guarda las direcciones en el estado local
                }
            } catch (error) {
                console.error("Error al recuperar direcciones:", error);
            } finally {
                this.isLoading = false; // Desactiva el loader
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
        async continueToCheckout() {
            localStorage.setItem("selectedAddressId", this.selectedAddress);
            this.isLoading = true;
            try{
                const response = await UserAccountService.sendAddressToOrder(this.selectedAddress);
                if(response === 201){
                    this.$router.push("/ConfirmOrder");
                }
                this.isLoading = false; // Desactiva el loader
            } catch(error) {
                console.error("Error al continuar con la compra:", error);
            } finally {
                this.isLoading = false; // Desactiva el loader
            }
        },
    },
};
</script>