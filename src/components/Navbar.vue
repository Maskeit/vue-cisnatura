<template>
    <nav class="sticky top-0 z-50 bg-white shadow-md">
        <!-- Fila Superior -->
        <div class="flex justify-between items-center px-4 py-2 lg:px-8">
            <!-- Logo -->
            <div class="flex items-center">
                <img src="/logocis.svg" alt="Logo" class="h-10 lg:h-16 mr-2" />
            </div>

            <!-- Barra de búsqueda -->
            <div class="hidden lg:flex items-center flex-grow mx-4">
                <SearchBar :categories="categories" />
            </div>

            <!-- Controles (ubicación y carrito) si le quito el hidden-->
            <div class="flex items-center space-x-4">
                <div class="hidden lg:flex items-center text-gray-700">
                    <MapPinIcon class="h-5 w-5 mr-1" />
                    <div class="text-sm">
                        <span>Entregas en</span><br />
                        <strong>México</strong>
                    </div>
                </div>
                <!-- Carrito -->
                <div v-if="userLoggedIn">
                    <router-link to="/Carrito" class="relative flex items-center">
                        <ShoppingCartIcon class="h-6 w-6 text-gray-700" />
                        <span v-if="cartCount > 0"
                            class="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
                            {{ cartCount }}
                        </span>
                    </router-link>
                </div>
                <!-- Botón del menú hamburguesa (solo en móviles) -->
                <button @click="toggleMenu" class="lg:hidden text-gray-700">
                    <Bars3Icon class="h-6 w-6" />
                </button>
            </div>
        </div>

        <!-- Menú de Navegación -->
        <div class="hidden lg:flex justify-center space-x-6 py-2 border-t">
            <router-link to="/" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Inicio
            </router-link>
            <router-link to="/Catalogo" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Productos
            </router-link>
            <router-link to="/Contacto" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Contacto
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
                    <li @click="goToAccount" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Cuenta
                    </li>
                    <li @click="logout" class="px-4 py-2 hover:bg-red-100 cursor-pointer">
                        Cerrar sesión
                    </li>
                </ul>
            </div>
        </div>

        <!-- Menú desplegable móvil -->
        <div :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
            class="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg transform transition-transform duration-300 lg:hidden">
            <button @click="toggleMenu" class="absolute top-4 right-4">
                <svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="pt-12 px-6">
                <SearchBar :categories="categories" />
                <ul class="space-y-4 mt-4">
                    <li>
                        <router-link @click="toggleMenu" to="/"
                            class="block text-green-600 hover:text-green-800">Inicio</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/Catalogo"
                            class="block text-green-600 hover:text-green-800">Productos</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/Carrito"
                            class="block text-green-600 hover:text-green-800">Carrito</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/Contacto"
                            class="block text-green-600 hover:text-green-800">Contacto</router-link>
                    </li>
                    <li v-if="!userLoggedIn">
                        <router-link @click="toggleMenu" to="/Login"
                            class="block text-green-600 hover:text-green-800">Iniciar Sesión</router-link>
                    </li>
                    <div v-else>
                        <div @click="toggleUserDropdown"
                            class="block text-green-600 hover:text-green-800 cursor-pointer">Cuenta
                            <ChevronDownIcon class="h-4 w-4" />
                        </div>
                        <ul v-if="userDropdownOpen" class="mt-2">
                            <li @click="goToAccount" class="block text-green-600 hover:text-green-800">Cuenta</li>
                            <li @click="logout" class="block text-red-600 hover:text-red-800">Cerrar Sesión</li>
                        </ul>
                    </div>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import SearchBar from "./SearchBar.vue";
import { Bars3Icon, ChevronDownIcon, ShoppingCartIcon, MapPinIcon } from "@heroicons/vue/24/outline";
import { AuthService } from "@/services/AuthService";
import { UserAccountService } from "@/services/UserAccountService";
import { EventBus } from "@/services/eventBus";
import Cookies from 'js-cookie';
import CartService from "@/services/CartService";
import { useUserStore } from "@/services/stores/userStore";

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
        ShoppingCartIcon,
        MapPinIcon,
        SearchBar
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

        // Escuchar actualizaciones del carrito
        EventBus.on("cart-updated", (cartItems) => {
            this.cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);
        });
        // Inicializar el contador del carrito desde el almacenamiento local
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("cart") || "[]");
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            localStorage.removeItem("cart"); // Limpiar datos inválidos
        }
        this.cartCount = cart.reduce((total, item) => total + item.cantidad, 0);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleOutsideClick);
    },
    methods: {
        async checkUserLoginStatus() {
            const userStore = useUserStore();
            try {
                // Verifica si hay un nombre en localStorage
                const cachedName = localStorage.getItem("username");
                if (cachedName) {
                    userStore.setUserFromCache(cachedName); // Carga el nombre desde el cache
                    this.userName = cachedName; // Mostrar en el navbar
                    this.userLoggedIn = true;
                    return;
                }
                // Si no está en el cache, intenta obtener los datos del servidor
                await userStore.fetchUserInfo();
                if (userStore.loggedIn) {
                    this.userName = userStore.name; // Mostrar en el navbar
                    this.userLoggedIn = true;
                } else {
                    this.userLoggedIn = false;
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                this.userLoggedIn = false; // Limpia el estado en caso de error
            }
        },
        toggleMenu() { // menu desplegable
            this.menuOpen = !this.menuOpen;
        },
        toggleUserDropdown() {
            this.userDropdownOpen = !this.userDropdownOpen;
            this.categoryDropdownOpen = false; // Cierra el dropdown de category        
        },
        toggleCategoryDropdown() {
            this.categoryDropdownOpen = !this.categoryDropdownOpen;
            this.userDropdownOpen = false; // Cierra el dropdown de usuario
        },
        handleOutsideClick(event) { // cierra el dropdown si se hace click fuera del dropdown
            if (!this.$el.contains(event.target) && this.categoryDropdownOpen || !this.$el.contains(event.target) && this.userDropdownOpen) {
                this.categoryDropdownOpen = false;
                this.userDropdownOpen = false;
            }
        },
        goToAccount() {
            this.$router.push("/Cuenta");
        },
        async logout() {
            try {
                if (!await AuthService.logout()) return;
                this.userLoggedIn = false;
                this.$router.push("/Login");
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