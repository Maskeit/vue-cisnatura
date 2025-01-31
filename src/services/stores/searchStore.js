import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
    state: () => ({
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
        setProducts(newProducts) {
            // Evitar duplicados y actualizar solo los productos nuevos
            const ids = new Set(this.products.map(p => p.id));
            this.products = [...this.products, ...newProducts.filter(p => !ids.has(p.id))];
        },
        clearProducts() {
            this.products = [];
        },
        searchLocal(query) {
            if (!query.trim()) {
                this.searchResults = [];
                return;
            }
            const lowerQuery = query.toLowerCase();
            this.searchResults = this.products.filter(product =>
                product.product_name.toLowerCase().includes(lowerQuery) ||
                product.description.toLowerCase().includes(lowerQuery) ||
                product.type.toLowerCase().includes(lowerQuery)
            );
        },
    }
});