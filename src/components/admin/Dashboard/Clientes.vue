<template>
    <div class="p-4">
        <!-- Otros componentes y elementos del CRUD -->
        <CrudHeader @nuevo-registro="abrirFormulario" @search="filtrar" />
        <CrudTable :items="registrosFiltrados" @editar="editarRegistro" @eliminar="confirmarEliminacion" />
        <CrudModal />
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import CrudHeader from '@/components/Admin/Crud/CrudHeader.vue';
import CrudTable from '@/components/Admin/Crud/CrudTable.vue';
import CrudModal from '@/components/Admin/Crud/CrudModal.vue';
import type { User } from '@/interfaces/User';
import { useOrderStore } from '@/components/Admin/stores/orderStore';
// Importa el archivo JSON que contiene los datos de ejemplo

// Aquí usamos el archivo JSON para inicializar la variable 'registros'
// Asegúrate de que las propiedades en el JSON sean compatibles con la interface Nodes.

const usersStore = useOrderStore(); // Accedemos al store

// Cargar usuarios cuando el componente se monta
const loadUsers = async () => {
    try {
        await usersStore.fetchUsers(); // Aseguramos que la lista se actualiza correctamente
    } catch (e) {
        console.error("Error al cargar los usuarios:", e);
    }
};
onMounted(loadUsers);


const searchTerm = ref('');
const mostrarModal = ref(false);
const registroSeleccionado = ref<User | null>(null);
// La lista de usuarios ahora se obtiene del estado de Pinia
const registros = computed(() => usersStore.users);

// Filtrado basado en la propiedad 'name' (asegúrate de que el JSON use el mismo nombre de propiedad)
const registrosFiltrados = computed(() => {
    if (!searchTerm.value) return registros.value;
    return registros.value.filter(r =>
        r.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

function abrirFormulario() {
    registroSeleccionado.value = null;
    mostrarModal.value = true;
}

function editarRegistro(registro: User) {
    registroSeleccionado.value = registro;
    mostrarModal.value = true;
}

function confirmarEliminacion(registro: User) {
    // Lógica para confirmar y eliminar
    registros.value = registros.value.filter(r => r.id !== registro.id);
}

function guardarRegistro(nuevoRegistro: User) {
    // Si el id es 0, se trata de una creación
    if (nuevoRegistro.id === 0) {
        nuevoRegistro.id = Date.now(); // Ejemplo para asignar un id único
        registros.value.push(nuevoRegistro);
    } else {
        // Actualización: busca y actualiza el registro
        const index = registros.value.findIndex(r => r.id === nuevoRegistro.id);
        if (index !== -1) {
            registros.value[index] = nuevoRegistro;
        }
    }
    mostrarModal.value = false;
}

function cerrarModal() {
    mostrarModal.value = false;
}

function filtrar(term: string) {
    searchTerm.value = term;
}
</script>