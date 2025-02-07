import axiosInstance from "../axiosInstance";
import { system } from "../system";
import { Products } from "@/interfaces/Products";

// Definir la estructura de la caché de productos
interface ProductCache {
  products: Products[];
  total: number;
}

let productsCache: Record<number, ProductCache> = {}; // Caché por página

const ProductService = {
  /**
   * Edita un producto en el sistema
   */
  async editProduct(data: FormData | Partial<Products>, isFormData: boolean): Promise<number> {
    if (!system.http.check.live()) throw new Error("El sistema no está disponible");

    try {
      const productId = isFormData ? Number(data.get("id")) : Number((data as Products).id);
      if (!productId) {
        console.error("❌ Error: Falta el ID del producto en editProduct:", data);
        throw new Error("Falta el ID del producto.");
      }

      const headers = isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

      console.log("📤 Enviando actualización al backend:", data);

      const response = await axiosInstance.put("/product/update", data, { headers });
      return response.data.status;
    } catch (error) {
      console.error("❌ Error al editar el producto:", error);
      throw error;
    }
  },

  /**
   * Crea un nuevo producto
   */
  async createProduct(formData: FormData): Promise<number> {
    if (!system.http.check.live()) throw new Error("El sistema no está disponible");

    try {
      const response = await axiosInstance.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        return response.data.status;
      } else {
        throw new Error("Error al crear el producto");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      throw error;
    }
  },

  /**
   * Elimina un producto por ID
   */
  async deleteProduct(productId: number): Promise<number> {
    if (!system.http.check.live()) throw new Error("El sistema no está disponible");

    try {
      const response = await axiosInstance.delete("/product/delete", {
        data: { pid: productId },
      });
      return response.data.status;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  },

  /**
   * Activa o desactiva un producto
   */
  async toggleProduct(productId: number): Promise<number> {
    if (!system.http.check.live()) throw new Error("El sistema no está disponible");

    try {
      const response = await axiosInstance.put("/product/toggle", {
        data: { pid: productId },
      });
      return response.data.status;
    } catch (error) {
      console.error("Error al alternar estado del producto:", error);
      throw error;
    }
  },

  /**
   * Obtiene productos del catálogo con paginación
   */
  async getCatalogoProducts(page: number = 1, limit: number = 16): Promise<ProductCache> {
    if (productsCache[page]) {
      return productsCache[page];
    }
    if (!system.http.check.live()) throw new Error("El sistema no está disponible");

    try {
      const response = await axiosInstance.get<{ data: { products: Products[]; totalProducts: number } }>(
        `/admin/products?page=${page}&limit=${limit}`
      );

      if (response.status === 200) {
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
   * Busca productos en caché o en el servidor
   */
  async searchProducts(query: string): Promise<{ products: Products[] }> {
    const lowerQuery = query.toLowerCase();

    // Buscar en caché antes de hacer una petición al servidor
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
   * Filtra productos por categoría desde la caché
   */
  filterProductsByCategory(category: string): Products[] {
    return Object.values(productsCache).flatMap((page) =>
      page.products.filter((product) => product.type.toLowerCase() === category.toLowerCase())
    );
  },

  /**
   * Obtiene todos los productos almacenados en caché
   */
  getAllCachedProducts(): Products[] {
    return Object.values(productsCache).reduce((acc, page) => acc.concat(page.products), []);
  },

  /**
   * Obtiene productos en caché por página
   */
  getCachedProductsByPage(page: number): Products[] {
    return productsCache[page]?.products || [];
  },
};

export default ProductService;