import axiosInstance from "./axiosInstance";
import { system } from "./system";
import { Carrito } from "@/interfaces/Carrito";
import { Products } from "@/interfaces/Products";
import { EventBus } from "@/services/eventBus"; // Para emitir eventos
import { CartProduct } from "@/interfaces/CartProduct";

const CartService = {
  /**
 * Agrega un producto al carrito con verificación de sesión
 */
  async addProductToCartWithAuth(product: Products, quantity: number = 1): Promise<boolean> {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      EventBus.emit("showModal", {
        message: "Para agregar productos al carrito es necesario tener una cuenta.",
        confirmText: "Iniciar Sesión",
        cancelText: "Cancelar",
      });
      return false;
    }

    try {
      const status = await CartService.addProduct(product.id, quantity);
      if (status === 201) {
        // Actualizar carrito en localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProduct = cart.find((item: Carrito) => item.productId === product.id);

        if (existingProduct) {
          existingProduct.cantidad += quantity;
        } else {
          cart.push({
            id: Date.now(),
            userId: 1, // Asumimos que viene de la sesión
            productId: product.id,
            cantidad: quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Emitir evento para actualizar la UI
        EventBus.emit("cart-updated", cart);
        return true;
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }

    return false;
  },
  /**
   * Agrega un producto al carrito
   */
  async addProduct(productId: number, quantity: number = 1): Promise<number | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.post<{ status: number }>("/product/cart/add", {
        pid: productId,
        cantidad: quantity,
      });
      return response.data.status; // 201 si se agregó correctamente
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      return null;
    }
  },

  /**
   * Obtiene la cantidad de productos en el carrito
   */
  async getCartCount(): Promise<number | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.get<{ data: number }>("/product/cart/count");
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener la cantidad de productos del carrito:", error);
      return null;
    }
  },

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  async updateProductQuantity(productId: number, quantity: number): Promise<boolean> {
    if (!system.http.check.live()) return false;
    try {
      const response = await axiosInstance.put<{ status: number }>("/product/cart/update", {
        pid: productId,
        cantidad: quantity,
      });

      return response.status === 200; // Retorna `true` si se actualizó correctamente
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      return false;
    }
  },

  /**
   * Elimina un producto del carrito
   */
  async removeProduct(cartItemId: number): Promise<boolean> {
    console.log("Remove Product", cartItemId);
    if (!system.http.check.live()) return false;
    try {
      const response = await axiosInstance.delete<{ status: number }>("/product/cart/delete", {
        data: { pid: cartItemId },
      });
  
      return response.status === 200;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      return false;
    }
  },
  /**
   * Obtiene el carrito del usuario
   */
  async getCart(): Promise<Carrito[]> {
    if (!system.http.check.live()) return [];
    try {
      const response = await axiosInstance.get<{ data: CartProduct[] }>("/product/cart/get");

      if (response.status === 204) {
        localStorage.setItem("cart", JSON.stringify([])); // Guardar un array vacío
        return [];
      }

      const cartItems = response.data.data || [];
      localStorage.setItem("cart", JSON.stringify(cartItems));
      return cartItems;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return [];
    }
  },

  /**
   * Crea una orden temporal con los productos en el carrito
   */
  async createTemporalOrder(payload: { products: Products[] }): Promise<number | null> {
    if (!system.http.check.live()) return null;
    try {
      const response = await axiosInstance.post<{ status: number }>("/product/cart/order", payload);
      return response.data.status;
    } catch (error) {
      console.error("Error al crear la orden temporal:", error);
      return null;
    }
  },
};

export default CartService;