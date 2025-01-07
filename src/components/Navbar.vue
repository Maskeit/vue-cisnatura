<template>
    <nav class="bg-white shadow-md">
        <!-- Fila superior -->
        <div class="flex justify-between items-center px-4 py-2">
            <!-- Logo -->
            <div class="flex items-center">
                <img src="/icons/logocis.svg" alt="Logo" class="h-12 mr-2" />
            </div>

            <!-- Barra de búsqueda -->
            <div class="hidden lg:block">
                <SearchBar :categories="categories" />
            </div>
            <!-- Ubicación -->
            <div class="hidden lg:flex items-center text-gray-700">
                <MapPinIcon class="h-6 w-6" />
                <div>
                    <small>Entregas en</small><br />
                    <strong>México</strong>
                </div>
            </div>
            <!-- Botón hamburguesa para dispositivos pequeños -->
            <button @click="toggleMenu" class="block lg:hidden text-gray-600">
                <Bars3Icon class="h-6 w-6" />
            </button>
        </div>

        <!-- Fila inferior -->
        <div class="flex justify-center items-center px-4 py-2">
            <!-- Menú desplegable móvil -->
            <div :class="menuOpen ? 'translate-x-0 z-20' : 'translate-x-full z-20'"
                class="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg p-6 transform transition-transform lg:hidden">
                <button @click="toggleMenu" class="absolute top-4 right-4 text-gray-700">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 class="text-lg font-semibold mb-4">Menú</h2>
                <SearchBar :categories="categories" />
                <ul class="space-y-4">
                    <li>
                        <router-link @click="toggleMenu" to="/"
                            class="text-green-600 hover:text-green-800">Inicio</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/Catalogo"
                            class="text-green-600 hover:text-green-800">Productos</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/Carrito"
                            class="text-green-600 hover:text-green-800">Carrito</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/Contacto"
                            class="text-green-600 hover:text-green-800">Contacto</router-link>
                    </li>
                    <li v-if="!userLoggedIn">
                        <router-link @click="toggleMenu" to="/Login" class="text-green-600 hover:text-green-800">Iniciar
                            Sesión</router-link>
                    </li>
                    <div v-if="userLoggedIn" class="relative group">
                        <button @click="toggleUserDropdown" class="hover:text-green-600 flex items-center space-x-1">
                            <span class="mr-2">{{ userName }}</span>
                            <ChevronDownIcon class="h-5 w-5" />
                        </button>
                        <ul v-if="userDropdownOpen"
                            class="absolute z-10 bg-white shadow-md border mt-2 rounded-md w-48">
                            <li @click="goToAccount" class="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                                Cuenta
                            </li>
                            <li @click="logout" class="hover:bg-red-100 px-4 py-2 cursor-pointer">
                                Cerrar sesión
                            </li>
                        </ul>
                    </div>
                </ul>
            </div>
            <!-- Botones de navegación -->
            <ul class="hidden lg:flex space-x-6 font-light">
                <li>
                    <router-link to="/" class="block px-4 py-2 text-center hover:bg-gray-100 rounded-md">
                        Inicio
                    </router-link>
                </li>
                <li>
                    <router-link to="/Catalogo" class="block px-4 py-2 text-center hover:bg-gray-100 rounded-md">
                        Productos
                    </router-link>
                </li>
                <li>
                    <router-link to="/Contacto" class="block px-4 py-2 text-center hover:bg-gray-100 rounded-md">
                        Contacto
                    </router-link>
                </li>
                <li>
                    <router-link v-if="!userLoggedIn" to="/Login"
                        class="block px-4 py-2 text-center hover:bg-green-100 rounded-md" active-class="bg-green-200">
                        Iniciar Sesión
                    </router-link>
                    <div v-else class="relative">
                        <button @click="toggleUserDropdown"
                            class="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md">
                            <span class="mr-2">{{ userName }}</span>
                            <ChevronDownIcon class="h-5 w-5" />
                        </button>
                        <ul v-if="userDropdownOpen"
                            class="absolute z-10 bg-white shadow-md border mt-2 rounded-md w-48">
                            <li @click="goToAccount" class="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                                Cuenta
                            </li>
                            <li @click="logout" class="hover:bg-red-100 px-4 py-2 cursor-pointer">
                                Cerrar sesión
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            <!-- Carrito -->
            <router-link to="/Carrito" class="flex items-center relative mx-3">
                Carrito
                <ShoppingCartIcon class="h-6 w-6 text-gray-700" />
                <span v-if="cartCount > 0"
                    class="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-2 text-sm">
                    {{ cartCount }}
                </span>
            </router-link>
        </div>
    </nav>
</template>

<script>
import SearchBar from "./SearchBar.vue";
import { Bars3Icon, ChevronDownIcon, ShoppingCartIcon, MapPinIcon } from "@heroicons/vue/24/outline";
import { AuthService } from "@/services/AuthService";
import { EventBus } from "@/services/eventBus";
import Cookies from 'js-cookie';
import CartService from "../services/CartService";
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
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        this.cartCount = cart.reduce((total, item) => total + item.cantidad, 0);
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
                const response = await AuthService.logout(); // Añade este método para manejar el cierre de sesión en el servidor
                var message = "";
                if (response !== 200) {
                    alert("No se pudo cerrar la sesion intente más tarde");
                    return;
                }
                localStorage.removeItem("Authorization");
                localStorage.removeItem("username");
                Cookies.remove('SSK');
                alert("Sesión cerrada correctamente");
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