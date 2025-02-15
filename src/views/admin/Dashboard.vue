<template>
    <div class="flex flex-col min-h-screen">
        <!-- Contenido principal -->
        <div class="flex flex-1 bg-[var(--color-highland-600)]">
            <!-- Sidebar -->
            <VerticalSidebar />
            <!-- Contenido dinámico -->
            <main class="flex-1 bg-gray-100 p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>
<script setup lang="js">
import VerticalSidebar from "@/components/Admin/Dashboard/Vertical-Sidebar.vue";
</script>