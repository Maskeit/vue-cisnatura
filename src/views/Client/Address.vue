<template>
  <div>
    <!-- Loader mientras se obtienen los domicilios -->
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Contenido principal -->
    <div v-else>
      <!-- Lista de direcciones -->
      <AddressList :addresses="addresses" @addressSelected="setSelectedAddress" @delete-address="handleDeleteAddress"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AddressList from "@/components/Client/Address/AddressList.vue";
import AddressForm from "@/components/Client/Address/AddressForm.vue";
import { useRouter } from "vue-router";
import { AddressService } from "@/services/Class/Client/AddressService";
import type { Address } from "@/interfaces/Address";

const addressService = new AddressService();
const selectedAddress = ref<number | null>(null);
const showForm = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const addresses = ref<Address[]>([]);
const router = useRouter();

onMounted(async () => {
  isLoading.value = true;
  const response = await addressService.getAllAddresses();
  if (response) {
    addresses.value = response;
  }
  isLoading.value = false;
});

const setSelectedAddress = (id: number) => {
  selectedAddress.value = id;
};

const handleDeleteAddress = async (id: number | string) => {
  const numericId = Number(id);
  if (isNaN(numericId)) return;
  const response = await addressService.deleteAddress(numericId);
  if (response === 200) {
    addresses.value = [...addresses.value.filter((address) => address.id !== numericId)];
  } else {
    console.error("No se pudo eliminar la dirección en el servidor.");
  }
};

const handleAddressSaved = async (newAddress: Omit<Address, "id" | "userId">) => {
  const status = await addressService.saveAddress(newAddress);
  if (status === 200) {
    await refreshAddressList();
    showForm.value = false;
  } else {
    console.error("No se pudo guardar la dirección. Código de respuesta:", status);
  }
};

const refreshAddressList = async () => {
  isLoading.value = true;
  const updatedAddresses = await addressService.getAllAddresses();
  if (updatedAddresses) {
    addresses.value = updatedAddresses;
  }
  isLoading.value = false;
};

const continueToCheckout = async () => {
  if (!selectedAddress.value) return;

  // Guardar el ID seleccionado en localStorage
  localStorage.setItem("selectedAddressId", selectedAddress.value.toString());

  isLoading.value = true;

  try {
    // Enviar el ID seleccionado al método sendAddressToOrder()
    const updateAddress = await addressService.sendAddressToOrder(selectedAddress.value);

    if (updateAddress === 201) {
      router.push("/confirm-order");
    } else {
      console.error("No se pudo actualizar la dirección del pedido.");
    }
  } catch (error) {
    console.error("Error al continuar con la compra:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>