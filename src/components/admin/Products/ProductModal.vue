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
                    <img :src="previewImage || `${V_Global_IMG}${editedProduct.thumb}`"
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
                        <Editor v-if="editedProduct" v-model="editedProduct.description" />
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

    <ConfirmationModal v-if="isToggleModalOpen" :isOpen="isToggleModalOpen"
        :title="editedProduct.active == 1 ? '¿Deshabilitar Producto?' : '¿Habilitar Producto?'" :message="editedProduct.active === 1
            ? 'Puedes habilitar este producto nuevamente más tarde.'
            : 'El producto estará habilitado para su visualización.'"
        :confirmText="editedProduct.active == 1 ? 'Deshabilitar' : 'Habilitar'" cancelText="Cancelar"
        @confirm="confirmToggleProduct" @cancel="isToggleModalOpen = false" />

    <ConfirmationModal v-if="isConfirmationModalOpen" :isOpen="isConfirmationModalOpen" title="¡Éxito!"
        message="El producto se actualizó correctamente." confirmText="Aceptar" @confirm="closeConfirmationModal" />
</template>

<script setup>
import { ref, watch } from "vue";
import Editor from '@/components/shared/Editor.vue';
import ConfirmationModal from "@/components/shared/ConfirmationModal.vue";
import { V_Global_IMG } from "@/services/system.js";

// Props
const props = defineProps({
    isOpen: Boolean,
    product: Object,
});

// Emitir eventos
const emit = defineEmits(["close", "save-product", "delete-product", "toggle-product"]);

// Estado reactivo
const editedProduct = ref({ ...props.product });
const previewImage = ref(null);
const isDeleteModalOpen = ref(false);
const isToggleModalOpen = ref(false);
const isConfirmationModalOpen = ref(false);

// Métodos
const closeModal = () => {
    emit("close");
};

const closeConfirmationModal = () => {
    isConfirmationModalOpen.value = false;
};

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        previewImage.value = URL.createObjectURL(file);
        editedProduct.value.imageFile = file;
    }
};

const saveProduct = () => {
    try {
        if (!editedProduct.value.id) {
            console.error("Error: El ID del producto es inválido:", editedProduct.value);
            return;
        }

        const hasImage = !!editedProduct.value.imageFile;
        let dataToSend;

        if (hasImage) {
            const formData = new FormData();
            formData.append("id", editedProduct.value.id); // ✅ Se envía como número

            formData.append("name", editedProduct.value.product_name);
            formData.append("description", editedProduct.value.description);
            formData.append("price", editedProduct.value.price);
            formData.append("stock", editedProduct.value.stock);
            if (editedProduct.value.imageFile) {
                formData.append("image", editedProduct.value.imageFile);
            }

            console.log("✅ Enviando datos con imagen (FormData):", Object.fromEntries(formData.entries())); // Depuración
            dataToSend = formData;
        } else {
            dataToSend = {
                id: Number(editedProduct.value.id), // 🔹 Convertir a número
                name: editedProduct.value.product_name,
                description: editedProduct.value.description,
                price: editedProduct.value.price,
                stock: editedProduct.value.stock,
            };
            console.log("✅ Enviando datos sin imagen (JSON):", dataToSend); // Depuración
        }

        emit("save-product", dataToSend, hasImage);
        isConfirmationModalOpen.value = true;
        closeModal();
    } catch (error) {
        console.error("❌ Error al guardar el producto:", error);
    }
};
const showDeleteConfirmation = () => {
    isDeleteModalOpen.value = true;
};

const confirmDeleteProduct = () => {
    isDeleteModalOpen.value = false;
    emit("delete-product", editedProduct.value.id);
    closeModal();
};
const confirmToggleProduct = () => {
    isToggleModalOpen.value = false;
    emit("toggle-product", editedProduct.value.id);
    closeModal();
};

const showToggleConfirmation = () => {
    isToggleModalOpen.value = true;
};


// Actualiza `editedProduct` cuando cambia `product`
watch(() => props.product, (newProduct) => {
    editedProduct.value = { ...newProduct };
}, { immediate: true });

</script>