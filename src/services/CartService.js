import axiosInstance from "./axiosInstance";
import { system } from "./system";
const CartService = {
  async addProduct(productId, quantity = 1) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.post(`/product/cart/add`, {
        pid: productId,
        cantidad: quantity,
      });
      const status = response.data.status; // 201, 401, etc... si es 201 es porque si se agrego
      return status;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      return;
    }
  },

  async getCartCount() {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get(`/product/cart/count`);
      return response.data.data; // La cantidad de productos
    } catch (error) {
      console.error(
        "Error al obtener la cantidad de productos del carrito:",
        error
      );
      return;
    }
  },

  async updateProductQuantity(productId, quantity) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.put(`/product/cart/update`, {
        pid: productId,
        cantidad: quantity,
      });

      // Verificar si se actualizó correctamente en el servidor
      if (response.status === 200) {
        return true; // Indica que se actualizó correctamente
      }
      return false; // Indica que no se actualizó
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      return;
    }
  },

  async removeProduct(productId) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.delete(`/product/cart/delete`, {
        data: { pid: productId }, // Pasamos el ID del producto como parte del body
      });

      if (response.status === 200) {
        return true; // Producto eliminado correctamente
      }

      return false; // Fallo en la eliminación
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      return;
    }
  },

  // Este metodo trae el carrito del ususario en formato json
  async getCart() {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.get(`/product/cart/get`);
      const cartItems = response.data.data; // Los productos del carrito
      localStorage.setItem("cart", JSON.stringify(cartItems)); // Guardar en el almacenamiento local
      return cartItems;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return;
    }
  },

  async createTemporalOrder(payload) {
    if (!system.http.check.live()) return;
    try {
      const response = await axiosInstance.post(`/product/cart/order`, payload); // añade los productos a una preorden de solo productos
      return response.data.status;
    } catch (error) {
      console.error("Error al crear la orden temporal:", error);
      return;
    }
  }
};

export default CartService;
