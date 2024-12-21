<template>
    <nav class="bg-white shadow-md p-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
            <img src="/icons/logocis.svg" alt="Logo" class="h-12 mr-2" />
        </div>
        <!-- Menú principal: visible en pantallas grandes -->
        <ul class="hidden md:flex space-x-6 font-light">
            <li>
                <router-link to="/" class="hover:text-green-600" active-class="text-green-600">Inicio</router-link>
            </li>
            <li>
                <router-link to="/Catalogo" class="hover:text-green-600"
                    active-class="text-green-600">Productos</router-link>
            </li>
            <li>
                <router-link to="/Contacto" class="hover:text-green-600"
                    active-class="text-green-600">Contacto</router-link>
            </li>
        </ul>
        <!-- Input de búsqueda -->
        <div class="hidden md:flex items-center space-x-2">
            <input type="text" placeholder="Buscar"
                class="border rounded-md p-2 w-60 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md">
                🔍
            </button>
        </div>
        <!-- Botón Carrito -->
        <div class="hidden md:flex items-center">
            <router-link to="/Carrito" class="flex items-center relative">
                <span class="text-gray-700">Carrito</span>
                <ShoppingCartIcon class="h-6 w-6 text-gray-700" />

                <span class="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-2 text-sm">
                    4
                </span>
            </router-link>
        </div>
        <!-- Botón del menú hamburguesa: visible solo en dispositivos pequeños -->
        <button @click="toggleMenu" class="block lg:hidden text-gray-600">
            <Bars3Icon class="h-6 w-6" />
        </button>

        <!-- Menú deslizable: visible cuando se hace clic en el botón hamburguesa -->
        <div :class="menuOpen ? 'translate-x-0 z-20' : 'translate-x-full z-20'"
            class="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg p-6 transform transition-transform md:hidden">
            <button @click="toggleMenu" class="absolute top-4 right-4 text-gray-700 focus:outline-none">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h2 class="text-lg font-semibold mb-4">Menú</h2>
            <!-- input de busqueda -->
            <div class="relative w-full mt-4">
                <input type="text" placeholder="Buscar"
                    class="border rounded-md p-2 w-full pr-12 focus:outline-none focus:ring-2 focus:ring-green-400" />
                <button
                    class="absolute top-0 right-0 h-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 rounded-r-md">
                    🔍
                </button>
            </div>
            <ul class="space-y-4">
                <li>
                    <router-link @click="toggleMenu" to="/" class="text-green-600 hover:text-green-800">
                        Inicio
                    </router-link>
                </li>
                <li>
                    <router-link @click="toggleMenu" to="/Catalogo" class="text-green-600 hover:text-green-800">
                        Productos
                    </router-link>
                </li>
                <li>
                    <router-link @click="toggleMenu" to="/Carrito" class="text-green-600 hover:text-green-800">
                        Carrito
                    </router-link>
                </li>
                <li>
                    <router-link @click="toggleMenu" to="/Contacto" class="text-green-600 hover:text-green-800">
                        Contacto
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { Bars3Icon, ShoppingCartIcon } from "@heroicons/vue/24/outline";

export default {
    components: {
        Bars3Icon,
        ShoppingCartIcon,
    },
    data() {
        return {
            menuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
    },
};
</script>

<style scoped>
/* Transiciones suaves para el menú */
.transform {
    transition: transform 0.3s ease-in-out;
}
</style>