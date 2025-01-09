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

            <!-- Calle y número -->
            <div class="mb-4">
                <label for="street" class="block text-gray-700 font-semibold">Calle y número</label>
                <input v-model="form.street" type="text" id="street"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
                    placeholder="Calle, número exterior e interior" required />
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
            <button type="submit"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md">
                Guardar dirección
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
            states: estadosmunicipios,
            cities: [],
            form: {
                name: "",
                rfc: "",
                street: "",
                colony: "",
                postalCode: "",
                phone: "",
                state: "",
                city: "",
            },
            saveAddress: [],
            loading: true,
        };
    },
    async mounted() {
        try {
            const address = await UserAccountService.getAddress();
            console.log(address);
        } catch (e) {

        }
    },
    methods: {
        updateCities() {
            // Obtiene las ciudades del estado seleccionado
            this.cities = this.states[this.form.state] || [];
        },
        submitForm: async function () {
            // Validación básica en el cliente
            if (
                !this.form.name ||
                !this.form.street ||
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
                this.loading = true;

                // Llamar al servicio para guardar la dirección
                const response = await UserAccountService.saveAddress(this.form);

                if (response.success) {
                    alert("Dirección guardada correctamente");
                    this.form = {
                        name: "",
                        rfc: "",
                        street: "",
                        colony: "",
                        postalCode: "",
                        phone: "",
                        state: "",
                        city: "",
                    };
                    this.$emit("addressSaved"); // Emitir evento
                } else {
                    alert(response.message);
                }
            } catch (error) {
                console.error("Error al guardar la dirección:", error);
                alert("Error al guardar la dirección. Intenta nuevamente.");
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* Ajustes visuales adicionales */
</style>