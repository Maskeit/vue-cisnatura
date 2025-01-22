<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full h-auto">
            <!-- Header -->
            <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-xl font-bold">Editar Producto</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                    ✕
                </button>
            </div>

            <!-- Modal Body -->
            <div class="flex flex-col md:flex-row h-auto overflow-auto">
                <!-- Imagen -->
                <div class="w-full md:w-1/2 p-4 flex flex-col items-center justify-center bg-gray-50">
                    <img :src="previewImage || `http://cisnaturatienda.local/app/pimg/${editedProduct.thumb}`"
                        :alt="editedProduct.product_name"
                        class="w-full max-h-64 md:max-h-full object-contain rounded mb-4" />
                    <input type="file" accept="image/*" @change="handleImageChange"
                        class="text-sm text-gray-600 cursor-pointer" />
                </div>

                <!-- Contenido -->
                <div class="w-full md:w-1/2 p-4 overflow-y-auto max-h-96">
                    <div class="mb-4">
                        <label for="productName" class="block text-sm font-medium text-gray-700">Nombre del
                            Producto</label>
                        <input id="productName" type="text" v-model="editedProduct.product_name"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg" />
                    </div>
                    <div class="mb-4">
                        <label for="productDescription"
                            class="block text-sm font-medium text-gray-700">Descripción</label>
                        <QuillEditor v-model:content="editedProduct.description" content-type="html" />
                    </div>
                    <div class="mb-4">
                        <label for="productPrice" class="block text-sm font-medium text-gray-700">Precio (MXN)</label>
                        <input id="productPrice" type="number" step="0.01" v-model="editedProduct.price"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg" />
                    </div>

                    <div class="mb-4">
                        <label for="productStock" class="block text-sm font-medium text-gray-700">Stock</label>
                        <input id="productStock" type="number" step="1" v-model="editedProduct.stock"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg" />
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white">
                <button @click="showToggleConfirmation"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-full shadow"> {{
                        editedProduct.active == 1 ? "Deshabilitar" : "Habilitar" }}
                </button>
                <div class="flex gap-2">
                    <button @click="saveProduct"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow">Guardar</button>
                    <button @click="showDeleteConfirmation"
                        class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full shadow">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Reutilizable para Confirmación -->
    <ConfirmationModal v-if="isDeleteModalOpen" :isOpen="isDeleteModalOpen" title="¿Eliminar Producto?"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?" confirmText="Eliminar" cancelText="Cancelar"
        @confirm="confirmDeleteProduct" @cancel="isDeleteModalOpen = false" />

    <ConfirmationModal v-if="isToggleModalOpen" :isOpen="isToggleModalOpen" title="¿Deshabilitar Producto?"
        message="Puedes habilitar este producto nuevamente más tarde." confirmText="Deshabilitar" cancelText="Cancelar"
        @confirm="confirmToggleProduct" @cancel="isToggleModalOpen = false" />
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill';
import ConfirmationModal from '@/components/shared/ConfirmationModal.vue';
//use admin 
export default {
    components: { QuillEditor, ConfirmationModal },
    props: {
        isOpen: Boolean,
        product: Object
    },
    data() {
        return {
            editedProduct: { ...this.product },
            previewImage: null,
            isDeleteModalOpen: false, // Controla el modal de confirmación
            isToggleModalOpen: false,
        };
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        handleImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.previewImage = URL.createObjectURL(file);
                this.editedProduct.imageFile = file;
            }
        },
        saveProduct() {
            const hasImage = !!this.editedProduct.imageFile; // Verifica si hay una imagen
            let dataToSend;

            if (hasImage) {
                // Construir FormData si hay una imagen
                const formData = new FormData();
                formData.append("id", this.editedProduct.id);
                formData.append("name", this.editedProduct.product_name);
                formData.append("description", this.editedProduct.description);
                formData.append("price", this.editedProduct.price);
                formData.append("stock", this.editedProduct.stock);
                formData.append("image", this.editedProduct.imageFile); // Agregar imagen
                dataToSend = formData;
            } else {
                // Usar JSON si no hay imagen
                dataToSend = {
                    id: this.editedProduct.id,
                    name: this.editedProduct.product_name,
                    description: this.editedProduct.description,
                    price: this.editedProduct.price,
                    stock: this.editedProduct.stock,
                };
            }

            // Emitir los datos al componente padre
            this.$emit("save-product", dataToSend, hasImage);
        },
        showDeleteConfirmation() {
            this.isDeleteModalOpen = true; // Abre el modal de confirmación
        },
        confirmDeleteProduct() {
            this.isDeleteModalOpen = false;
            this.$emit("delete-product", this.editedProduct.id); // Emite el evento para eliminar el producto
            this.closeModal(); // Cierra el modal principal
        },
        showToggleConfirmation() {
            this.isToggleModalOpen = true;
        },
        confirmToggleProduct() {
            this.isToggleModalOpen = false;
            this.$emit("toggle-product", this.editedProduct.id);
            this.closeModal(); // Cierra el modal principal
        },
    },
    watch: {
        product: {
            immediate: true,
            handler(newProduct) {
                this.editedProduct = { ...newProduct };
            }
        }
    }
};

</script>