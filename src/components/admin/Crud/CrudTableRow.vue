<template>
    <tr>
        <td class="px-6 py-4 whitespace-nowrap">{{ item.id }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ item.email }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ item.telefono }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ item.active }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ item.createdAt }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-blue-600 hover:text-blue-800 mr-2" @click="$emit('editar', item)">Editar</button>
            <button class="text-red-600 hover:text-red-800" @click="$emit('eliminar', item)">Eliminar</button>
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { User } from '@/interfaces/User';

const props = defineProps<{item: User;}>();

const emits = defineEmits<{
    (e: 'editar', item: User): void;
    (e: 'eliminar', item: User): void;
}>();
</script>