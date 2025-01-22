<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-700">Agregar Nuevo Producto</h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        class="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="validateAndCreateProduct">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Campos del formulario -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                        <input v-model="newProduct.product_name" type="text"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            :class="{ 'border-red-500': errors.product_name }" />
                        <p v-if="errors.product_name" class="text-red-500 text-sm mt-1">El nombre es obligatorio.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Precio</label>
                        <input v-model="newProduct.price" type="number" min="0"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            :class="{ 'border-red-500': errors.price }" />
                        <p v-if="errors.price" class="text-red-500 text-sm mt-1">El precio es obligatorio.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Stock</label>
                        <input v-model="newProduct.stock" type="number" min="0"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            :class="{ 'border-red-500': errors.stock }" />
                        <p v-if="errors.stock" class="text-red-500 text-sm mt-1">El stock es obligatorio.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Categoría</label>
                        <select v-model="newProduct.type"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            :class="{ 'border-red-500': errors.type }">
                            <option value="" disabled>Seleccionar categoría</option>
                            <option value="tintura">Tinturas</option>
                            <option value="cds">Dióxido de cloro</option>
                            <option value="curso">Cursos/Talleres</option>
                            <option value="paquete">Paquetes</option>
                            <option value="otro">Productos Naturales</option>
                        </select>
                        <p v-if="errors.type" class="text-red-500 text-sm mt-1">La categoría es obligatoria.</p>
                    </div>
                </div>

                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700">Descripción</label>
                    <QuillEditor v-model:content="newProduct.description" content-type="html"
                        :class="{ 'border-red-500': errors.description }" />
                    <p v-if="errors.description" class="text-red-500 text-sm mt-1">La descripción es obligatoria.</p>
                </div>

                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700">Imagen (Se recomienda pixelaje de 500 x 500)</label>
                    <input type="file" @change="handleImageUpload" class="mt-1 block w-full text-sm text-gray-500"
                        :class="{ 'border-red-500': errors.image }" />
                    <p v-if="errors.image" class="text-red-500 text-sm mt-1">La imagen es obligatoria.</p>
                </div>

                <div class="flex justify-end mt-6">
                    <button type="submit"
                        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:ring-green-500 focus:ring-offset-2">
                        Guardar Producto
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill';

export default {
    components: { QuillEditor },
    props: {
        isOpen: Boolean,
        product: Object
    },
    data() {
        return {
            newProduct: {
                product_name: "",
                price: "",
                stock: "",
                type: "",
                description: "", // Contenido del editor Quill
                image: null,
            },
            errors: {
                product_name: false,
                price: false,
                stock: false,
                type: false,
                description: false,
                image: false,
            },
        };
    },
    methods: {
        handleImageUpload(event) {
            this.newProduct.image = event.target.files[0];
        },

        validateAndCreateProduct() {
            // Resetear errores
            this.errors = {
                product_name: !this.newProduct.product_name.trim(),
                price: !this.newProduct.price,
                stock: !this.newProduct.stock,
                type: !this.newProduct.type,
                description: !this.newProduct.description.trim(),
                image: !this.newProduct.image,
            };

            // Verificar si hay errores
            const hasErrors = Object.values(this.errors).some((error) => error);

            if (hasErrors) {
                console.error("Hay errores en el formulario.");
                return; // Detener la ejecución si hay errores
            }

            // Crear FormData y enviar
            const formData = new FormData();
            formData.append("product_name", this.newProduct.product_name);
            formData.append("price", this.newProduct.price);
            formData.append("stock", this.newProduct.stock);
            formData.append("type", this.newProduct.type);
            formData.append("description", this.newProduct.description);
            if (this.newProduct.image) {
                formData.append("thumb", this.newProduct.image);
            }

            // Emitir evento al componente padre
            this.$emit("create-product", formData);
        },
    },
};
</script>

<style scoped>
/* Estilo adicional */
</style>