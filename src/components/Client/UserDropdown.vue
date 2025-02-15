<template>
    <div class="relative">
        <!-- Botón para abrir el menú -->
        <button @click="toggleDropdown" class="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 rounded transition flex items-center">
            Cuenta
            <ChevronDownIcon class="h-4 w-4 ml-1 text-gray-500" />
        </button>

        <!-- Menú desplegable de usuario -->
        <div v-show="isOpen" ref="dropdownRef"
            class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50  ">
            <div class="px-4 py-3 cursor-pointer hover:bg-gray-100 " @click="goToAccount">
                <p class="text-sm font-medium text-gray-900 ">{{ name }}</p>
            </div>
            <div class="border-t border-gray-200 "></div>
            <button @click="emitLogout" class="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ">
                Cerrar sesión
            </button>
            <div class="border-t border-gray-200 "></div>
            <div class="px-4 py-3 text-xs text-gray-500 dark:text-gray-500">
                {{ email }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const props = defineProps<{
    name: string;
    email: string;
}>();

const emit = defineEmits(["logout"]);

// Alternar visibilidad del dropdown
const toggleDropdown = (event: Event) => {
    event.stopPropagation(); // Evita que el evento de clic se propague
    isOpen.value = !isOpen.value;
    console.log("Estado de isOpen:", isOpen.value);
};

// Redirigir a la página de cuenta
const goToAccount = () => {
    router.push("/Cuenta");
    isOpen.value = false;
};

// Emitir evento de cierre de sesión
const emitLogout = () => {
    emit("logout");
    isOpen.value = false;
};

// Cerrar dropdown si se hace clic fuera
const handleClickOutside = (event: Event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>