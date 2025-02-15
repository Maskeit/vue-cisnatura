import { computed } from "vue";
import { useProductsStore } from "@/services/stores/productStore";

export function useCatalog() {
    const productStore = useProductsStore();

    // Filtrar productos según la categoría seleccionada y usar `allProducts`
    const filteredProducts = computed(() => {
        if (!productStore.selectedCategory) {
            return productStore.products; // Si no hay categoría, mostrar productos de la página actual
        }

        // Si hay categoría, buscar en `allProducts` para incluir los de todas las páginas cargadas
        return productStore.allProducts.filter(product =>
            product.type.toLowerCase() === productStore.selectedCategory.toLowerCase()
        );
    });

    // Método para cambiar la categoría y actualizar la lista de productos filtrados
    const filterByCategory = (category: string) => {
        productStore.selectedCategory = category;
    };

    return {
        filteredProducts,
        filterByCategory
    };
}