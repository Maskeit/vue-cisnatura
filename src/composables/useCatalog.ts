import { ref } from "vue";
import ProductService from "@/services/ProductService";
import { Products } from "@/interfaces/Products";

export function useCatalog() {
    const products = ref<Products[]>([]);
    const filteredProducts = ref<Products[]>([]);
    const selectedProduct = ref<Products | null>(null);
    const isLoading = ref<boolean>(false);
    const isModalOpen = ref<boolean>(false);
    const currentPage = ref<number>(1);
    const totalPages = ref<number>(0);
    const limit = ref<number>(16);

    const fetchProducts = async () => {
        isLoading.value = true;
        try {
            const { products: fetchedProducts, total } = await ProductService.getCatalogoProducts(currentPage.value, limit.value);
            products.value = fetchedProducts;
            filteredProducts.value = [...fetchedProducts];
            totalPages.value = Math.ceil(total / limit.value);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const openModal = (product: Products) => {
        selectedProduct.value = product;
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        selectedProduct.value = null;
    };

    const changePage = async (page: number) => {
        if (page > 0 && page <= totalPages.value) {
            currentPage.value = page;
            await fetchProducts();
        }
    };

    const filterByCategory = (category: string) => {
        filteredProducts.value = category
            ? products.value.filter((product) => product.type.toLowerCase() === category.toLowerCase())
            : [...products.value];
    };

    return {
        products,
        filteredProducts,
        selectedProduct,
        isLoading,
        isModalOpen,
        currentPage,
        totalPages,
        fetchProducts,
        openModal,
        closeModal,
        changePage,
        filterByCategory
    };
}