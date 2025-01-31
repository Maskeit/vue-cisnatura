import axiosInstance from "../axiosInstance";
import { system } from "../system";
//use admin
let productsCache = {}; // Cache por página
const ProductService = {
  async editProduct(data, isFormData) {
    if (!system.http.check.live()) return;
    try {
      const headers = isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

      const response = await axiosInstance.put("/product/update", data, {
        headers,
      });

      return response.data.status;
    } catch (error) {
      console.error("Error al editar el producto:", error);
      throw error;
    }
  },

  async createProduct(formData) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        return response.data.status; // Devuelve el estado de éxito
      } else {
        throw new Error("Error al crear el producto");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  },

  async deleteProduct(product) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.delete("/product/delete", {
        data: { pid: product },
      });
      return response.data.status;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  },

  async toggleProduct(product) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.put("/product/toggle", {
        data: { pid: product },
      });
      return response.data.status;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  },

  async getCatalogoProducts(page = 1, limit = 16) {
    if (productsCache[page]) {
      return productsCache[page];
    }
    if(!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get(`/admin/products?page=${page}&limit=${limit}`);
      const data = response; 
      if (data.status === 200) {
        productsCache[page] = {
          products: response.data.data.products,
          total: response.data.data.totalProducts,
        };
        return productsCache[page];
      }

      throw new Error("Error al obtener productos");
    } catch (err) {
      console.error(err);
      return { products: [], total: 0 };
    }
  },
  // hace la busqueda de coincidencias ya sea en local o en el servidor
  async searchProducts(query) {
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
      const response = await axiosInstance.get("/search", { params: { search: query }});

      if (response.status === 200 && response.data.data.length > 0) {
        return { products: response.data.data };
      }

      return { products: [] };
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      return { products: [] };
    }
  },
  filterProductsByCategory(category) {
    return Object.values(productsCache).flatMap((page) =>
      page.products.filter(
        (product) => product.type.toLowerCase() === category.toLowerCase()
      )
    );
  },
  getAllCachedProducts() {
    return Object.values(productsCache).reduce((acc, page) => {
      return acc.concat(page.products);
    }, []);
  },
  getCachedProductsByPage(page) {
    return productsCache[page]?.products || [];
  },
};
export default ProductService;
