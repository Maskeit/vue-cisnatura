import axiosInstance from "./axiosInstance";
let productsCache = {}; // Cache por página
async function getProducts() {
  try {
    const response = await axiosInstance.get("/products");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
}

async function getCatalogoProducts(page = 1, limit = 16) {
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
}
async function searchProducts(query) {
  const lowerQuery = query.toLowerCase();

  // Buscar primero en la caché local (todas las páginas cargadas)
  const localResults = getAllCachedProducts().filter(
      (product) =>
          product.product_name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery) ||
          product.type.toLowerCase().includes(lowerQuery)
  );

  if (localResults.length > 0) {
      return { products: localResults, message: null };
  }

  // Si no hay resultados locales, buscar en el servidor
  try {
      const response = await axiosInstance.get("/search", {
          params: { search: query },
      });

      if (response.status === 200 && response.data.data.length > 0) {
          const fetchedProducts = response.data.data;

          // Agregar los productos al caché si no existen
          fetchedProducts.forEach((product) => {
              const isAlreadyCached = Object.values(productsCache)
                  .flatMap((page) => page.products)
                  .some((p) => p.id === product.id);

              if (!isAlreadyCached) {
                  if (!productsCache[1]) {
                      productsCache[1] = { products: [], total: 0 };
                  }
                  productsCache[1].products.push(product);
              }
          });

          return { products: fetchedProducts, message: null };
      }

      return { products: [], message: "No se encontraron productos." };
  } catch (error) {
      console.error("Error al buscar productos en el servidor:", error);
      return {
          products: [],
          message: "Error al buscar productos. Intente más tarde.",
      };
  }
}
function filterProductsByCategory(category) {
  return Object.values(productsCache).flatMap((page) =>
    page.products.filter(
      (product) => product.type.toLowerCase() === category.toLowerCase()
    )
  );
}

function getAllCachedProducts() {
  return Object.values(productsCache).flatMap((page) => page.products);
}
function getCachedProductsByPage(page) {
  return productsCache[page]?.products || [];
}
export default {
  getProducts,
  getCatalogoProducts,
  filterProductsByCategory,
  getAllCachedProducts,
  searchProducts,
  getCachedProductsByPage, // Nuevo método
};
