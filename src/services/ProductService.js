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
    console.log(`Productos cargados desde el cache para la página ${page}`);
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

function filterProductsByCategory(category) {
  return Object.values(productsCache).flatMap((page) =>
    page.products.filter(
      (product) => product.type.toLowerCase() === category.toLowerCase()
    )
  );
}

export default { getProducts, getCatalogoProducts, filterProductsByCategory };
