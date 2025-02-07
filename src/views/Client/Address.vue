<template>
    <div>
      <!-- Loader mientras se obtienen los domicilios -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
  
      <!-- Contenido principal -->
      <div v-else>
        <!-- Lista de direcciones -->
        <AddressList :addresses="addresses" @addressSelected="setSelectedAddress" @updateAddresses="updateAddresses" @showAddressForm="showForm = true" />
        
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
  import UserAccountService from "@/services/UserAccountService";
  import { Address } from "@/interfaces/Address";
  import { useRouter } from "vue-router";
  
  const addresses = ref<Address[]>([]);
  const selectedAddress = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const showForm = ref<boolean>(false);
  const router = useRouter();
  
  // Cargar direcciones al montar el componente
  onMounted(async () => {
    await fetchAddresses();
  });
  
  const fetchAddresses = async () => {
    isLoading.value = true;
    try {
      const response = await UserAccountService.getAllAddress();
      if (response) {
        addresses.value = response;
      }
    } catch (error) {
      console.error("Error al recuperar direcciones:", error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const setSelectedAddress = (id: string) => {
    selectedAddress.value = id;
  };
  
  const updateAddresses = (newAddresses: Address[]) => {
    if (!newAddresses.find((address) => address.id === selectedAddress.value)) {
      selectedAddress.value = null; // Si la dirección seleccionada fue eliminada, limpiar
    }
    addresses.value = newAddresses;
  };
  
  const handleAddressSaved = async () => {
    await fetchAddresses();
  };
  
  const continueToCheckout = async () => {
    if (!selectedAddress.value) return;
    localStorage.setItem("selectedAddressId", selectedAddress.value);
    isLoading.value = true;
    try {
      const response = await UserAccountService.sendAddressToOrder(selectedAddress.value);
      if (response === 201) {
        router.push("/confirm-order");
      }
    } catch (error) {
      console.error("Error al continuar con la compra:", error);
    } finally {
      isLoading.value = false;
    }
  };
  </script>