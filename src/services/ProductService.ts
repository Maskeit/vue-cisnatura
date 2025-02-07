import axiosInstance from "./axiosInstance";
import { Products } from "@/interfaces/Products"
//cliente
// Definir interfaces para tipar correctamente los productos y la caché
// usar la interface Products

interface ProductCache {
  products: Products[]; // Ahora usa la interfaz importada
  total: number;
}

// Caché local de productos, indexado por página
const productsCache: Record<number, ProductCache> = {};

const ProductService = {

  /**
   * Obtiene todos los productos desde el servidor para el Home.
   */
  async getProducts(): Promise<Products[]> {
    try {
      const response = await axiosInstance.get<{ data: Products[] }>("/products");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  },

  /**
   * Obtiene los productos paginados del catálogo.
   */
  async getCatalogoProducts(page: number = 1, limit: number = 16): Promise<ProductCache> {
    if (productsCache[page]) {
      return productsCache[page];
    }

    try {
      const response = await axiosInstance.get<{ data: { products: Products[]; totalProducts: number }; status: number }>(
        `/catalogo?page=${page}&limit=${limit}`
      );

      if (response.data.status === 200) {
        productsCache[page] = {
          products: response.data.data.products,
          total: response.data.data.totalProducts,
        };
        return productsCache[page];
      }

      throw new Error("Error al obtener productos");
    } catch (err) {
      console.error("Error en `getCatalogoProducts`:", err);
      return { products: [], total: 0 };
    }
  },

  /**
   * Realiza una búsqueda de productos por nombre, descripción o tipo.
   */
  async searchProducts(query: string): Promise<{ products: Products[] }> {
    const lowerQuery = query.toLowerCase();

    // Buscar primero en caché local antes de consultar el servidor
    const cachedResults = ProductService.getAllCachedProducts().filter(
      (product) =>
        product.product_name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.type.toLowerCase().includes(lowerQuery)
    );

    if (cachedResults.length > 0) {
      return { products: cachedResults };
    }

    try {
      const response = await axiosInstance.get<{ data: Products[] }>("/search", {
        params: { search: query },
      });

      if (response.status === 200 && response.data.data.length > 0) {
        return { products: response.data.data };
      }

      return { products: [] };
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      return { products: [] };
    }
  },

  /**
   * Filtra los productos en caché por categoría.
   */
  filterProductsByCategory(category: string): Products[] {
    return Object.values(productsCache).flatMap((page) =>
      page.products.filter((product) => product.type.toLowerCase() === category.toLowerCase())
    );
  },

  /**
   * Obtiene todos los productos en caché sin importar la página.
   */
  getAllCachedProducts(): Products[] {
    return Object.values(productsCache).reduce((acc, page) => acc.concat(page.products), []);
  },

  /**
   * Obtiene los productos en caché de una página específica.
   */
  getCachedProductsByPage(page: number): Products[] {
    return productsCache[page]?.products || [];
  },
};

export default ProductService;