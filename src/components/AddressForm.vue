<template>
    <div class="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <!-- Título -->
        <h2 class="text-2xl font-bold mb-6 text-green-700">
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
                <input v-model="form.name" type="text" id="name"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="Tu nombre completo" required />
            </div>

            <!-- RFC -->
            <div class="mb-4">
                <label for="rfc" class="block text-gray-700 font-semibold">RFC <span
                        class="text-sm text-gray-500">(Opcional)</span></label>
                <input v-model="form.rfc" type="text" id="rfc"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="RFC (opcional)" />
            </div>

            <!-- Calle -->
            <div class="mb-4">
                <label for="street" class="block text-gray-700 font-semibold">Calle</label>
                <input v-model="form.street" type="text" id="street"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="Calle" />
            </div>

            <!-- Número -->
            <div class="mb-4">
                <label for="number" class="block text-gray-700 font-semibold">Número</label>
                <input v-model="form.number" type="text" id="number"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="Número exterior" />
            </div>

            <!-- Colonia o fraccionamiento -->
            <div class="mb-4">
                <label for="colony" class="block text-gray-700 font-semibold">Colonia / Fraccionamiento</label>
                <input v-model="form.colony" type="text" id="colony"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="Colonia o fraccionamiento" required />
            </div>

            <!-- Código postal -->
            <div class="mb-4">
                <label for="postalCode" class="block text-gray-700 font-semibold">Código Postal</label>
                <input v-model="form.postalCode" type="text" id="postalCode"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="Por ejemplo 12345" required />
            </div>

            <!-- Teléfono -->
            <div class="mb-4">
                <label for="phone" class="block text-gray-700 font-semibold">Teléfono de contacto</label>
                <input v-model="form.phone" type="text" id="phone"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="Número de contacto" required />
            </div>

            <!-- Estado -->
            <div class="mb-4">
                <label for="state" class="block text-gray-700 font-semibold">Estado</label>
                <select v-model="form.state" @change="updateCities" id="state"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    required>
                    <option value="" disabled>Selecciona un estado</option>
                    <option v-for="(cities, state) in states" :key="state" :value="state">{{ state }}</option>
                </select>
            </div>

            <!-- Ciudad -->
            <div class="mb-4">
                <label for="city" class="block text-gray-700 font-semibold">Municipio</label>
                <select v-model="form.city" id="city"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    required>
                    <option value="" disabled>Selecciona una ciudad</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
            </div>

            <!-- Botón -->
            <button type="submit" :disabled="isSaving"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md">
                <span v-if="!isSaving">Guardar dirección</span>
                <span v-else class="flex items-center justify-center gap-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Guardando...
                </span>
            </button>
        </form>
    </div>
</template>

<script>
import estadosmunicipios from "@/assets/estados-municipios.json";
import { UserAccountService } from "@/services/UserAccountService";
export default {
    data() {
        return {
            isSaving: false,
            states: estadosmunicipios,
            cities: [],
            form: {
                name: "",
                rfc: "",
                street: "",
                number: "", // Campo adicional para el número
                colony: "",
                postalCode: "",
                phone: "",
                state: "",
                city: "",
            },
            saveAddress: [],
        };
    },
    methods: {
        updateCities() {
            // Obtiene las ciudades del estado seleccionado
            this.cities = this.states[this.form.state] || [];
        },
        submitForm: async function () {
            // validar si ya hay 3 direcciones
            if (this.saveAddress.length >= 3) {
                alert("Ya tienes 3 direcciones guardadas");
                return;
            }
            // Validación básica en el cliente
            if (
                !this.form.name ||
                !this.form.street ||
                !this.form.number ||
                !this.form.colony ||
                !this.form.postalCode ||
                !this.form.phone ||
                !this.form.state ||
                !this.form.city
            ) {
                alert("Por favor, completa todos los campos obligatorios.");
                return;
            }

            try {
                this.isSaving = true;
                const fullStreet = `${this.form.street} ${this.form.number}`.trim();
                const payload = {
                    ...this.form,
                    street: fullStreet,
                };
                // Llamar al servicio para guardar la dirección
                const response = await UserAccountService.saveAddress(payload);

                if (response === 200) {
                    this.form = {
                        name: "",
                        rfc: "",
                        street: "",
                        number: "",
                        colony: "",
                        postalCode: "",
                        phone: "",
                        state: "",
                        city: "",
                    };
                    this.$emit("addressSaved"); // Emitir evento para refrescar la lista
                } else {
                    alert("Error al guardar la dirección. Intenta nuevamente.");
                }
            } catch (error) {
                console.error("Error al guardar la dirección:", error);
                alert("Error al guardar la dirección. Intenta nuevamente.");
            } finally {
                this.isSaving = false;
            }
        },
    },
};
</script>

<style scoped>
/* Ajustes visuales adicionales */
</style>