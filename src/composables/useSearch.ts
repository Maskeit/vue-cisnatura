import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSearchStore } from "@/services/stores/searchStore";
import ProductService from "@/services/ProductService";
import { Products } from "@/interfaces/Products";

export function useSearch() {
  const searchStore = useSearchStore();
  const route = useRoute();
  const categories = ref(searchStore.categories);
  const isLoading = ref(false);

  watch(() => route.query.q, async (newSearch) => {
    if (newSearch && newSearch.trim()) {
      const lowerSearch = newSearch.toLowerCase();
      const cachedResults = searchStore.products.filter(
        (product) =>
          product.product_name.toLowerCase().includes(lowerSearch) ||
          product.description.toLowerCase().includes(lowerSearch) ||
          product.type.toLowerCase().includes(lowerSearch)
      );

      if (cachedResults.length > 0) {
        searchStore.setSearchResults(cachedResults);
        return;
      }

      isLoading.value = true;
      try {
        const { products: serverResults } = await ProductService.searchProducts(newSearch);
        searchStore.setSearchResults(serverResults);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        searchStore.setSearchResults([]);
      } finally {
        isLoading.value = false;
      }
    } else {
      searchStore.setSearchResults([...searchStore.products]);
    }
  });

  return { categories, isLoading };
}