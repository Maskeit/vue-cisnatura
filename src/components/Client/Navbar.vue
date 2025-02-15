<template>
    <!-- Loader de pantalla completa -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-gray-4 border-green-500"></div>
    </div>
    <nav class="sticky top-0 z-50 bg-white shadow-md">
        <div class="flex justify-between items-center px-4 py-2 lg:px-8">
            <!-- Logo -->
            <div class="flex items-center">
                <img src="/logocis.svg" alt="Logo" class="h-10 lg:h-16 mr-2" />
            </div>

            <!-- Barra de búsqueda -->
            <div class="hidden lg:flex items-center flex-grow mx-4">
                <SearchBar @updateResults="updateFilteredProducts" />
            </div>

            <!-- Controles (ubicación y carrito) -->
            <div class="flex items-center space-x-4">
                <div class="hidden lg:flex items-center text-gray-700">
                    <MapPinIcon class="h-5 w-5 mr-1" />
                    <div class="text-sm">
                        <span>Entregas en</span><br />
                        <strong>México</strong>
                    </div>
                </div>

                <!-- Carrito -->
                <div v-if="userStore.loggedIn">
                    <router-link to="/Carrito" class="relative flex items-center">
                        <ShoppingCartIcon class="h-6 w-6 text-gray-700" />
                        <span v-if="cartCount > 0"
                            class="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
                            {{ cartCount }}
                        </span>
                    </router-link>
                </div>
                <!-- Botón del menú hamburguesa -->
                <button @click="toggleMenu" class="lg:hidden p-2 rounded-md">
                    <Bars3Icon class="h-6 w-6 text-gray-700" />
                </button>
            </div>
        </div>

        <!-- Menú de Navegación para escritorio -->
        <div class="hidden lg:flex justify-center space-x-6 py-2 relative">
            <router-link to="/" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Productos
            </router-link>
            <router-link to="/Contacto" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Contacto
            </router-link>

            <!-- Si el usuario no ha iniciado sesión, mostrar "Iniciar Sesión" -->
            <router-link v-if="!userStore.loggedIn" to="/Login"
                class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Iniciar Sesión
            </router-link>
            <!-- Si el usuario ha iniciado sesión, mostrar UserDropdown -->
            <UserDropdown v-else :name="userStore.user?.name" :email="userStore.user?.email" @logout="logout" />
        </div>
        <!-- Menú desplegable -->
        <transition name="slide-fade">
            <div v-if="menuOpen" class="absolute top-full left-0 w-full bg-white shadow-md">
                <ul class="flex flex-col items-center space-y-4 py-4">
                    <li>
                        <router-link @click="toggleMenu" to="/"
                            class="text-gray-700 hover:text-green-800">Productos</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleMenu" to="/Contacto"
                            class="text-gray-700 hover:text-green-800">Contacto</router-link>
                    </li>
                    <li v-if="!userStore.loggedIn">
                        <router-link @click="toggleMenu" to="/Login" class="text-gray-700 hover:text-green-800">Iniciar
                            Sesión</router-link>
                    </li>
                    <li v-else>
                        <button @click="toggleUserDropdown"
                            class="text-gray-700 hover:text-green-800 flex items-center">
                            {{ userStore.name }}
                            <ChevronDownIcon class="h-4 w-4 ml-1" />
                        </button>
                        <ul v-if="userDropdownOpen" class="mt-2">
                            <li @click="goToAccount" class="text-gray-700 hover:text-green-800">Cuenta</li>
                            <li @click="logout" class="text-red-600 hover:text-red-800">Cerrar Sesión</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </transition>
    </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/services/stores/userStore";
import { useRouter } from "vue-router";
import { ShoppingCartIcon, MapPinIcon, ChevronDownIcon, Bars3Icon } from "@heroicons/vue/24/outline";
import SearchBar from "@/components/Client/SearchBar.vue";
import { EventBus } from "@/services/eventBus";
import { AuthService } from "@/services/AuthService";
import Cookies from "js-cookie";
import { useSearchStore } from "@/services/stores/searchStore";
import type { Products } from "@/interfaces/Products";
import UserDropdown from "@/components/Client/UserDropdown.vue";


const searchStore = useSearchStore();
const userStore = useUserStore();
const router = useRouter();

// Tipado de props
defineProps<{
    categories: { displayName: string; value: string | null }[];
}>();

// Estados reactivos
const filteredProducts = ref<Products[]>([]);
const products = ref<Products[]>([]);
const isLoading = ref<boolean>(false);
const menuOpen = ref<boolean>(false);

const cartCount = ref<number>(0);

// Alternar visibilidad del menú
const toggleMenu = (): void => {
    menuOpen.value = !menuOpen.value;
};

const userDropdownOpen = ref<boolean>(false);

const toggleUserDropdown = (state?: boolean): void => {
    userDropdownOpen.value = state !== undefined ? state : !userDropdownOpen.value;
};

// Cargar información del usuario si no está disponible
onMounted(async () => {
    if (!userStore.user) {
        await userStore.fetchUserInfo();
    }

    // Escuchar actualizaciones del carrito
    EventBus.on("cart-updated", (cartItems: { cantidad: number }[]) => {
        cartCount.value = cartItems.reduce((total, item) => total + item.cantidad, 0);
    });

    // Inicializar el contador del carrito desde localStorage
    try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]") as { cantidad: number }[];
        cartCount.value = cart.reduce((total, item) => total + item.cantidad, 0);
    } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart"); // Limpiar datos inválidos
    }
});


// Actualizar productos filtrados
const updateFilteredProducts = (searchResults: Products[]): void => {
    filteredProducts.value = searchResults.length > 0 ? searchResults : [...products.value];
};

// asi se usa Cerrar sesión
const logout = async (): Promise<void> => {
    try {
        isLoading.value = true; // Mostrar loader

        // Intentar cerrar sesión en el backend
        const logoutSuccess = await AuthService.logout();
        if (!logoutSuccess) {
            console.error("No se pudo cerrar sesión correctamente en el servidor.");
        }

        // Limpieza de sesión
        Cookies.remove("Authorization", { path: "/", domain: "" }); // Eliminar token en cookies
        localStorage.clear(); // Eliminar datos del usuario
        userStore.clearUser(); // Limpiar store de usuario

        // Redirigir al login
        router.push("/Login");
    } catch (error) {
        console.error("Error cerrando sesión:", error);
    } finally {
        isLoading.value = false; // Ocultar loader
    }
};
</script>