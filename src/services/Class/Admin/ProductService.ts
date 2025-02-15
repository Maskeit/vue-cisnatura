import axiosInstance from "@/services/axiosInstance";
import { system } from "@/services/system";
import { Products } from "@/interfaces/Products";
import { useSearchAdminStore } from "@/components/Admin/stores/searchAdminStore";

// Definir la estructura de la caché de productos
interface ProductCache {
    products: Products[];
    total: number;
}


export class ProductService {
    private productsCache: Record<number, ProductCache> = {}; // Caché por página

    // verificar primero si el usuario esta logueado
    constructor() {
        system.initializeAuth();
    }
    /**
     * Obtiene productos del catálogo con paginación
     */
    async getCatalogoProducts(page: number = 1, limit: number = 16): Promise<ProductCache> {
        if (this.productsCache[page]) {
            return this.productsCache[page];
        }
        if (!system.http.check.live()) throw new Error("El sistema no está disponible");

        try {
            const response = await axiosInstance.get<{ data: { products: Products[]; totalProducts: number } }>(
                `/admin/products?page=${page}&limit=${limit}`
            );

            if (response.status === 200) {
                const fetchedProducts = response.data.data.products;
                this.productsCache[page] = {
                    products: response.data.data.products,
                    total: response.data.data.totalProducts,
                };
                const searchAdminStore = useSearchAdminStore();
                searchAdminStore.setAdminProducts(fetchedProducts);
                return this.productsCache[page];
            }

            throw new Error("Error al obtener productos");
        } catch (err) {
            console.error("Error en `getCatalogoProducts`:", err);
            return { products: [], total: 0 };
        }
    }
    /**
     * Edita un producto en el sistema
     */
    async editProduct(data: FormData | Partial<Products>, isFormData: boolean): Promise<number> {
        if (!system.http.check.live()) throw new Error("El sistema no está disponible");

        try {
            const productId = isFormData ? Number(data.get("id")) : Number((data as Products).id);
            if (!productId) {
                throw new Error("Falta el ID del producto.");
            }
            const headers = isFormData
                ? { "Content-Type": "multipart/form-data" }
                : { "Content-Type": "application/json" };

            const response = await axiosInstance.put("/product/update", data, { headers });
            return response.data.status;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
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
    }

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
    }

    /**
     * Activa o desactiva un producto
     */
    async toggleProduct(productId: number): Promise<number> {
        if (!system.http.check.live()) throw new Error("El sistema no está disponible");

        try {
            const response = await axiosInstance.put("/product/toggle", { pid: productId });

            return response.data.status;
        } catch (error) {
            console.error("Error al alternar estado del producto:", error);
            throw error;
        }
    }

    /**
     * Filtra productos por categoría desde la caché
     */
    filterProductsByCategory(category: string): Products[] {
        return Object.values(this.productsCache).flatMap((page) =>
            page.products.filter((product) => product.type.toLowerCase() === category.toLowerCase())
        );
    }

    /**
     * Obtiene todos los productos almacenados en caché
     */
    getAllCachedProducts(): Products[] {
        return Object.values(this.productsCache).reduce((acc, page) => acc.concat(page.products), []);
    }

    /**
     * Obtiene productos en caché por página
     */
    getCachedProductsByPage(page: number): Products[] {
        return this.productsCache[page]?.products || [];
    }
}