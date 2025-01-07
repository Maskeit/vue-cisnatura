import axiosInstance from "./axiosInstance";

const CartService = {
  async addProduct(productId, quantity = 1) {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("No se encontró el token de autorización.");
      throw new Error("No token provided");
    }

    try {
      const response = await axiosInstance.post(`/product/cart/add`, {
        pid: productId,
        cantidad: quantity,
      });
      const status = response.data.status; // 201, 401, etc... si es 201 es porque si se agrego
      return status;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  },

  async getCartCount() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("No se encontró el token de autorización.");
      throw new Error("No token provided");
    }

    try {
      const response = await axiosInstance.get(`/product/cart/count`);
      return response.data.data; // La cantidad de productos
    } catch (error) {
      console.error(
        "Error al obtener la cantidad de productos del carrito:",
        error
      );
      throw error;
    }
  },

  async updateProductQuantity(productId, quantity) {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("No se encontró el token de autorización.");
      throw new Error("No token provided");
    }

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
      throw error;
    }
  },

  async removeProduct(productId) {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("No se encontró el token de autorización.");
      throw new Error("No token provided");
    }

    try {
      const response = await axiosInstance.delete(`/product/cart/delete`, {
        data: { pid: productId }, // Pasamos el ID del producto como parte del body
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return true; // Producto eliminado correctamente
      }

      return false; // Fallo en la eliminación
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  },

  // Este metodo trae el carrito del ususario en formato json
  async getCart() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("No se encontró el token de autorización.");
      throw new Error("No token provided");
    }
    try {
      const response = await axiosInstance.get(`/product/cart/get`);
      const cartItems = response.data.data; // Los productos del carrito
      localStorage.setItem("cart", JSON.stringify(cartItems)); // Guardar en el almacenamiento local
      return cartItems;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  },
};

export default CartService;
