import { defineStore } from "pinia";
import type { Products } from "@/interfaces/Products";
import { computed } from "vue";
import { useProductsStore } from "@/services/stores/productStore";
interface Category {
    displayName: string;
    value: string | null;
}

interface SearchState {
    searchResults: Products[];
    products: Products[],
    categories: Category[];
    currentPage: number;
    perPage: number;
    query: string;
}

export const useSearchStore = defineStore("search", {
    state: (): SearchState => ({
        searchResults: [],
        products: [],
        categories: [
            { displayName: "Todos los productos", value: null },
            { displayName: "Tinturas", value: "tintura" },
            { displayName: "Dióxido de cloro", value: "cds" },
            { displayName: "Cursos/Talleres", value: "curso" },
            { displayName: "Paquetes", value: "paquete" },
            { displayName: "Productos Naturales", value: "otro" },
        ],
        currentPage: 1,
        perPage: 16,
        query: "",
    }),
    getters: {
        /**
         * Obtiene todos los productos desde el store de productos
         */
        allProducts(): Products[] {
            const productStore = useProductsStore();
            return productStore.allProducts.length > 0 ? productStore.allProducts : productStore.products;
        }
    },

    actions: {
        /**
        /**
         * Realiza una búsqueda en memoria sin llamar a la API
         */
        searchLocal(query: string): void {
            this.query = query.trim();
            
            if (!this.query) {
                this.clearSearch();
                return;
            }

            const lowerQuery = query.toLowerCase();
            this.searchResults = this.allProducts.filter((product) =>
                product.product_name.toLowerCase().includes(lowerQuery) ||
                product.description.toLowerCase().includes(lowerQuery) ||
                product.type?.toLowerCase().includes(lowerQuery)
            );
        },
        /**
         * Filtra solo el producto seleccionado por ID
         */
        filterSelectedProduct(productId: number): void {
            this.searchResults = this.allProducts.filter(product => product.id === productId);
        },

        /**
         * Restablece la búsqueda y muestra todos los productos.
         */
        clearSearch(): void {
            this.query = "";
            this.searchResults = [...this.products];
        },
    },
});