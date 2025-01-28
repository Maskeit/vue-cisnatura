<template>
    <aside class="w-64  text-white flex flex-col h-full">
        <div class="p-6 text-center text-xl font-bold border-b border-gray-700">
            Panel de Administración
        </div>
        <nav class="flex-1">
            <ul class="mt-6">
                <li v-for="panel in panels" @click="navigateTo(panel.path)"
                    class="flex items-center p-4 cursor-pointer hover:bg-gray-700 transition"
                    :class="{ 'bg-gray-800': route.path === panel.path }">
                    <span class="text-lg mr-4">{{ panel.icon }}</span>
                    <span>{{ panel.name }}</span>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute(); // Obtenemos la ruta activa para marcar el estado

// Definimos los paneles con rutas exactas del router
const panels = [
    { name: "Pedidos", icon: "📋", path: "/Dashboard/RecentOrder" },
    { name: "Reporte de ventas", icon: "📊", path: "/Dashboard/SalesReport" },
    { name: "Productos", icon: "📦", path: "/Dashboard/Products" },
    { name: "Clientes", icon: "👥", path: "/Dashboard/Clients" },
    { name: "Configuración", icon: "⚙️", path: "/Dashboard/Settings" },
];

const navigateTo = (path: string) => {
    router.push(path); // Navega a la ruta correspondiente
};
</script>
