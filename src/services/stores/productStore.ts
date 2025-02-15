import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Products } from "@/interfaces/Products";
import { productService } from "@/services/Class/Client/ProductServices";
// integrado
// Instancia del servicio de productos
const productServiceInstance = new productService();

export const useProductsStore = defineStore("products", () => {
    // Estado para todos los productos cargados en memoria (todas las páginas)
    const allProducts = ref<Products[]>([]);
    
    // Estado reactivo para los productos visibles en la página actual
    const products = ref<Products[]>([]);
    const totalProducts = ref<number>(0);
    const loading = ref<boolean>(false);

    // Estado para la paginación
    const currentPage = ref<number>(1);
    const totalPages = computed(() => Math.ceil(totalProducts.value / 16)); // Suponiendo 16 productos por página

    // Estado para la categoría seleccionada
    const selectedCategory = ref<string | null>(null);

    // Estado para el modal
    const isModalOpen = ref<boolean>(false);
    const selectedProduct = ref<Products | null>(null);

    // Método para cargar productos por página
    async function fetchProducts(page: number = currentPage.value, limit: number = 16) {
        loading.value = true;
        try {
            const { productList, totalProducts: total } = await productServiceInstance.getProducts(page, limit);
            
            // Verificar si `productList` tiene datos antes de modificar el estado
            if (productList && productList.length > 0) {
                // Agregamos los productos de esta página a `allProducts`, evitando duplicados
                const mergedProducts = [...allProducts.value, ...productList];
                allProducts.value = Array.from(new Map(mergedProducts.map(item => [item.id, item])).values());

                // Actualizamos `products` con los productos de la página actual
                products.value = productList;
                totalProducts.value = total;
                currentPage.value = page;
            } else {
                console.warn("No se recibieron productos desde el servidor.");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            loading.value = false;
        }
    }

    // Método para cambiar de página
    function changePage(newPage: number) {
        if (newPage > 0 && newPage <= totalPages.value) {
            currentPage.value = newPage;
            fetchProducts(newPage); // Cargar los productos de la nueva página
        }
    }

    // Computed para filtrar productos según la categoría seleccionada
    const filteredProducts = computed(() => {
        if (!selectedCategory.value) {
            return allProducts.value.length > 0 ? allProducts.value : products.value; // Mostrar todos si no hay categoría
        }

        return allProducts.value.filter(product =>
            product.type.toLowerCase() === selectedCategory.value!.toLowerCase()
        );
    });

    // Método para cambiar la categoría
    function filterByCategory(category: string) {
        selectedCategory.value = category;
    }

    // Métodos para manejar el modal
    function openModal(product: Products) {
        selectedProduct.value = product;
        isModalOpen.value = true;
    }

    function closeModal() {
        selectedProduct.value = null;
        isModalOpen.value = false;
    }

    return {
        allProducts,
        products,
        totalProducts,
        loading,
        fetchProducts,
        isModalOpen,
        selectedProduct,
        openModal,
        closeModal,
        // Paginación
        currentPage,
        totalPages,
        changePage,
        // Filtros
        selectedCategory,
        filteredProducts,
        filterByCategory
    };
});