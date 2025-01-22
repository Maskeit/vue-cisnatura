import CartService from "@/services/CartService";
import { EventBus } from "@/services/eventBus";

const CartManager = {
  async addProductToCart(product, quantity = 1) {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      EventBus.emit("showModal", {
        message: "Para agregar productos al carrito es necesario tener una cuenta.",
        confirmText: "Iniciar Sesión",
        cancelText: "Cancelar",
      });
      return;
    }

    try {
      const status = await CartService.addProduct(product.id, quantity);
      if (status === 201) {
        // Actualizar carrito en localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProduct = cart.find((item) => item.product_id === product.id);

        if (existingProduct) {
          existingProduct.cantidad += quantity;
        } else {
          cart.push({
            product_id: product.id,
            product_name: product.product_name,
            cantidad: quantity,
            price: product.price,
            thumb: product.thumb,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Emitir evento para notificar actualizaciones
        EventBus.emit("cart-updated", cart);
        return true;
      } else {
        console.error("No se pudo agregar el producto al carrito");
        return false;
      }
    } catch (error) {
      console.error("Error al manejar el carrito:", error);
      return false;
    }
  },
};

export default CartManager;