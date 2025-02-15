<template>
  <div class="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
    <!-- Título -->
    <h2 class="text-2xl font-bold mb-6 text-[var(--color-highland-600)]">
      Agrega una dirección para tu envío
    </h2>
    <p class="text-gray-600 mb-6">
      Envío de productos solo en México. Por favor, llena los campos requeridos.
    </p>

    <!-- Formulario -->
    <form @submit.prevent="submitForm">
      <!-- Nombre completo -->
      <div class="mb-4">
        <label for="name" class="block text-gray-700 font-semibold">Nombre completo</label>
        <input v-model="form.fullName" type="text" id="name"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          placeholder="Tu nombre completo" required />
      </div>

      <!-- RFC -->
      <div class="mb-4">
        <label for="rfc" class="block text-gray-700 font-semibold">RFC <span
            class="text-sm text-gray-500">(Opcional)</span></label>
        <input v-model="form.RFC" type="text" id="rfc"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          placeholder="RFC (opcional)" />
      </div>

      <!-- Calle -->
      <div class="mb-4">
        <label for="street" class="block text-gray-700 font-semibold">Calle</label>
        <input v-model="form.street" type="text" id="street"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          placeholder="Calle" />
      </div>

      <!-- Número -->
      <div class="mb-4">
        <label for="number" class="block text-gray-700 font-semibold">Número de casa / apartamento</label>
        <input v-model="form.number" type="text" id="number"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          placeholder="Número exterior" />
      </div>

      <!-- Colonia o fraccionamiento -->
      <div class="mb-4">
        <label for="colony" class="block text-gray-700 font-semibold">Colonia / Fraccionamiento</label>
        <input v-model="form.colonia" type="text" id="colony"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          placeholder="Colonia o fraccionamiento" required />
      </div>

      <!-- Código postal -->
      <div class="mb-4">
        <label for="postalCode" class="block text-gray-700 font-semibold">Código Postal</label>
        <input v-model="form.postalcode" type="number" id="postalCode"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          placeholder="Por ejemplo 12345" required />
      </div>

      <!-- Teléfono -->
      <div class="mb-4">
        <label for="phone" class="block text-gray-700 font-semibold">Teléfono de contacto</label>
        <input v-model="form.telefono" type="text" id="phone"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          placeholder="Número de contacto" required />
      </div>

      <!-- Estado -->
      <div class="mb-4">
        <label for="state" class="block text-gray-700 font-semibold">Estado</label>
        <select v-model="form.estado" @change="updateCities" id="state"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          required>
          <option value="" disabled>Selecciona un estado</option>
          <option v-for="(cities, state) in states" :key="state" :value="state">{{ state }}</option>
        </select>
      </div>

      <!-- Ciudad -->
      <div class="mb-4">
        <label for="city" class="block text-gray-700 font-semibold">Municipio</label>
        <select v-model="form.ciudad" id="city"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
          required>
          <option value="" disabled>Selecciona una ciudad</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>

      <!-- Botón -->
      <button type="submit" :disabled="isSaving"
        class="w-full bg-[var(--color-highland-400)] hover:bg-[var(--color-highland-600)] text-white font-semibold py-2 rounded-md">
        <span v-if="!isSaving">Guardar dirección</span>
        <span v-else class="flex items-center justify-center gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
          Guardando...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import estadosmunicipios from "@/utils/json/estados.json";
import type { Address } from "@/interfaces/Address";

const emit = defineEmits(["addressSaved"]);

const isSaving = ref<boolean>(false);
const states = ref<Record<string, string[]>>(estadosmunicipios);
const cities = ref<string[]>([]);

// Datos del formulario
const form = reactive<{
  fullName: string;
  RFC: string | null;
  telefono: string;
  colonia: string;
  street: string;
  number: string;
  estado: string;
  ciudad: string;
  postalcode: string;
}>({
  fullName: "",
  RFC: "",
  telefono: "",
  colonia: "",
  street: "",
  number: "",
  estado: "",
  ciudad: "",
  postalcode: "",
});

// Método para actualizar la lista de ciudades cuando se selecciona un estado
const updateCities = () => {
  cities.value = states.value[form.estado] || [];
};

// Método para emitir los datos al componente padre
const submitForm = () => {
  if (!/^\d{5}$/.test(form.postalcode)) {
    alert("El código postal debe ser un número de 5 dígitos.");
    return;
  }

  if (!form.fullName || !form.street || !form.number || !form.colonia || !form.postalcode || !form.telefono || !form.estado || !form.ciudad) {
    alert("Por favor, completa todos los campos obligatorios.");
    return;
  }
  isSaving.value = true;
  const newAddress = {
    fullName: form.fullName,
    RFC: form.RFC || "",
    telefono: form.telefono,
    colonia: form.colonia,
    calle: `${form.street} ${form.number}`,
    estado: form.estado,
    ciudad: form.ciudad,
    postalcode: parseInt(form.postalcode),
  };
  emit("addressSaved", newAddress);
  isSaving.value = false;
};
</script>