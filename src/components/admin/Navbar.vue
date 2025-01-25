<template>
    <nav class="sticky top-0 z-50 bg-white shadow-md">
        <!-- Fila Superior -->
        <div class="flex justify-between items-center px-4 py-2 lg:px-8">
            <!-- Logo -->
            <div class="flex items-center">
                <img src="/icons/logocis.svg" alt="Logo" class="h-10 lg:h-16 mr-2" />
            </div>
            <div class="hidden lg:flex justify-center space-x-6 py-2">
                <router-link to="/AdminProducts" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                    Productos
                </router-link>
                <router-link to="/Dashboard/RecentOrder" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                    Ventas
                </router-link>
                <router-link v-if="!userLoggedIn" to="/Login"
                    class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                    Iniciar Sesión
                </router-link>
                <div v-else class="relative">
                    <button @click="toggleUserDropdown"
                        class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition flex items-center">
                        {{ userName }}
                        <ChevronDownIcon class="h-4 w-4 ml-1" />
                    </button>
                    <ul v-if="userDropdownOpen" class="absolute bg-white border shadow-lg mt-2 rounded-md py-1 w-48">
                        <li @click="logout" class="px-4 py-2 hover:bg-red-100 cursor-pointer">
                            Cerrar sesión
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Controles (ubicación y carrito) si le quito el hidden-->
            <div class="flex items-center space-x-4">
                <!-- Botón del menú hamburguesa (solo en móviles) -->
                <button @click="toggleMenu" class="lg:hidden text-gray-700">
                    <Bars3Icon class="h-6 w-6" />
                </button>
            </div>
        </div>

        <!-- Menú de Navegación -->


        <!-- Menú desplegable móvil -->
        <div :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
            class="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg transform transition-transform duration-300 lg:hidden">
            <button @click="toggleMenu" class="absolute top-4 right-4">
                <svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="pt-12 px-6">
                <ul class="space-y-4 mt-4">
                    <li>
                        <router-link @click="toggleMenu" to="/"
                            class="block text-green-600 hover:text-green-800">Inicio</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/xqc/AdminProducts"
                            class="block text-green-600 hover:text-green-800">Productos</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/xqc/AdminDashboard"
                            class="block text-green-600 hover:text-green-800">Ventas</router-link>
                    </li>
                    <li>
                        <button @click="logout" class="block text-red-600 hover:text-red-800">Cerrar Sesión</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>

import { Bars3Icon, ChevronDownIcon, ShoppingCartIcon, MapPinIcon } from "@heroicons/vue/24/outline";
import { AuthService } from "@/services/AdminServices/AuthService";
import { EventBus } from "@/services/eventBus";
import Cookies from 'js-cookie';
//use admin 
export default {
    props: {
        categories: {
            type: Array,
            required: true,
        },
    },
    components: {
        Bars3Icon,
        ChevronDownIcon,
    },
    data() {
        return {
            menuOpen: false,
            userDropdownOpen: false, // Controla el dropdown del usuario
            userLoggedIn: false,
            userName: null,
            cartCount: 0
        };
    },
    async mounted() {
        // Revisa si hay un usuario logueado y actualiza el Navbar
        this.checkUserLoginStatus();
        document.addEventListener("click", this.handleOutsideClick);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleOutsideClick);
    },
    methods: {
        async checkUserLoginStatus() {
            try {
                const cachedName = localStorage.getItem("userName");
                if (cachedName) {
                    this.userName = cachedName;
                    this.userLoggedIn = true;
                    return;
                }

                const userData = await AuthService.getUserInfo();
                if (userData && userData.name) {
                    this.userName = userData.name;
                    this.userLoggedIn = true;
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                this.userLoggedIn = false; // Asegura que el estado se limpie
            }
        },
        toggleMenu() { // menu desplegable
            this.menuOpen = !this.menuOpen;
        },
        toggleUserDropdown() {
            this.userDropdownOpen = !this.userDropdownOpen;
            this.categoryDropdownOpen = false; // Cierra el dropdown de category        
        },
        handleOutsideClick(event) { // cierra el dropdown si se hace click fuera del dropdown
            if (!this.$el.contains(event.target) && this.categoryDropdownOpen || !this.$el.contains(event.target) && this.userDropdownOpen) {
                this.categoryDropdownOpen = false;
                this.userDropdownOpen = false;
            }
        },

        async logout() {
            try {
                if (!await AuthService.logout()) return;
                this.userLoggedIn = false;
                this.$router.push("/xqc/AdminLogin");
                return;
            } catch (error) {
                console.error("Error cerrando sesión:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Transiciones para el menú hamburguesa */
.transform {
    transition: transform 0.3s ease-in-out;
}

.group:hover .dropdown-menu {
    display: block;
}

.dropdown-menu {
    display: none;
    position: absolute;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
    z-index: 10;
    min-width: 12rem;
}
</style>