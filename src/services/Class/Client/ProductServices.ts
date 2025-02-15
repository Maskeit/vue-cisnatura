import axiosInstance from "@/services/axiosInstance";
import { Products } from "@/interfaces/Products";

interface ProductCache {
    productList: Products[];
    totalProducts: number;
}
// Caché local de productos, indexado por página
const productsCache: Record<number, ProductCache> = {};

export class productService {
    async getProducts(page: number = 1, limit: number = 16): Promise<ProductCache> {
        // Si la página ya está en caché, la devolvemos
        if (productsCache[page]) {
            return productsCache[page];
        }
        try {
            // Petición a la API con paginación
            const response = await axiosInstance.get<{
                status: number;
                message: string;
                data: { products: Products[]; totalProducts: number };
            }>(`/catalogo?page=${page}&limit=${limit}`);
    
            // Extraemos productos y total
            const { products, totalProducts } = response.data.data;
    
            // Guardamos en caché
            productsCache[page] = { productList: products, totalProducts };
    
            return productsCache[page];
        } catch (error: any) {
            console.error("Error fetching products:", error);
            throw new Error("Failed to fetch products.");
        }
    }
}