import { defineStore } from "pinia";
import type { Products } from "@/interfaces/Products";

interface Category {
    displayName: string;
    value: string | null;
}

interface SearchState {
    searchTerm: string;
    searchResults: Products[];
    isLoading: boolean;
    errorMessage: string;
    products: Products[];
    categories: Category[];
}

export const useSearchStore = defineStore("search", {
    state: (): SearchState => ({
        searchTerm: "",
        searchResults: [],
        isLoading: false,
        errorMessage: "",
        products: [], // Almacena los productos cargados en el catálogo
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
        setProducts(newProducts: Products[]): void {
            // Evitar duplicados y actualizar solo los productos nuevos
            const ids = new Set(this.products.map(p => p.id));
            this.products = [...this.products, ...newProducts.filter(p => !ids.has(p.id))];
        },

        clearProducts(): void {
            this.products = [];
        },

        searchLocal(query: string): void {
            if (!query.trim()) {
                this.searchResults = [];
                return;
            }

            const lowerQuery = query.toLowerCase();
            this.searchResults = this.products.filter((product) =>
                product.product_name.toLowerCase().includes(lowerQuery) ||
                product.description.toLowerCase().includes(lowerQuery) ||
                product.type.toLowerCase().includes(lowerQuery)
            );
        },
    },
});