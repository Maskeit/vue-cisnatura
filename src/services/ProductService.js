import axiosInstance from "./axiosInstance";
//cliente
let productsCache = {}; // Cache por página
const ProductService = {
  async getProducts() {
    try {
      const response = await axiosInstance.get("/products");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  },

  async getCatalogoProducts(page = 1, limit = 16) {
    if (productsCache[page]) {
      return productsCache[page];
    }

    try {
      const response = await axiosInstance.get(
        `/catalogo?page=${page}&limit=${limit}`
      );
      const data = response.data;

      if (data.status === 200) {
        productsCache[page] = {
          products: data.data.products,
          total: data.data.totalProducts,
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