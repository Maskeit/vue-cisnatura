import { defineStore } from "pinia";
import type { Products } from "@/interfaces/Products";

interface Category {
    displayName: string;
    value: string | null;
}
interface SearchAdminState {
    searchResults: Products[];
    adminProducts: Products[];
    categories : Category[];
}

export const useSearchAdminStore = defineStore("searchAdmin", {
    state: (): SearchAdminState => ({
        searchResults: [],
        adminProducts: [], // 🔹 Aquí guardaremos los productos en caché
        categories: [
            { displayName: "Todos los productos", value: null },
            { displayName: "Tinturas", value: "tintura" },
            { displayName: "Dióxido de cloro", value: "cds" },
            { displayName: "Cursos/Talleres", value: "curso" },
            { displayName: "Paquetes", value: "paquete" },
            { displayName: "Productos Naturales", value: "otro" },
        ],
    }),

    actions: {
        /**
         * Guarda los productos en caché cuando se cargan desde `getCatalogoProducts`
         */
        setAdminProducts(newProducts: Products[]): void {
            this.adminProducts = [...newProducts]; // Guardar en caché para búsqueda rápida
        },

        /**
         * Busca productos en memoria sin llamar a la API
         */
        searchAdminLocal(query: string): void {
            if (!query.trim()) {
                this.searchResults = [...this.adminProducts]; // Mostrar todos si el campo está vacío
                return;
            }

            const lowerQuery = query.toLowerCase();
            this.searchResults = this.adminProducts.filter((product) =>
                product.product_name.toLowerCase().includes(lowerQuery) ||
                product.description.toLowerCase().includes(lowerQuery) ||
                product.type?.toLowerCase().includes(lowerQuery)
            );
        },

        /**
         * Filtrar solo el producto seleccionado
         */
        filterSelectedProduct(productId: number): void {
            this.searchResults = this.adminProducts.filter(product => product.id === productId);
        },

        /**
         * Restablece la búsqueda y muestra todos los productos.
         */
        clearSearch(): void {
            this.searchResults = [...this.adminProducts];
        },
    },
});