<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">Revisión de tu pedido</h2>
        <p v-if="selectedAddress">
            Tu pedido será enviado a: <br />
            <strong>{{ selectedAddress.fullName }}</strong><br />
            {{ selectedAddress.calle }}, {{ selectedAddress.colonia }}, {{ selectedAddress.ciudad }},
            {{ selectedAddress.estado }}, CP: {{ selectedAddress.postalcode }}
        </p>
        <p v-else>
            No se ha seleccionado un domicilio.
        </p>
    </div>
</template>

<script>
import { UserAccountService } from "@/services/UserAccountService";

export default {
    data() {
        return {
            selectedAddress: null, // Almacena el domicilio completo
        };
    },
    async mounted() {
        const selectedAddressId = localStorage.getItem("selectedAddressId");
        if (selectedAddressId) {
            const response = await UserAccountService.getAddressById(selectedAddressId);
            if (response) {
                this.selectedAddress = response;
            }
        }
    }
};
</script>