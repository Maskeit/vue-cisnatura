<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Estructura del layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna de productos -->
      <div class="lg:col-span-2">
        <h2 class="text-2xl font-bold text-gray-600">Productos del carrito</h2>

        <!-- Loader mientras se traen los productos -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
        </div>

        <!-- Mostrar mensaje si el carrito está vacío -->
        <div v-else-if="cartProducts.length === 0" class="text-center py-10">
          <p class="text-gray-500">No hay productos en tu carrito.</p>
          <router-link to="/Catalogo"
            class="mt-4 bg-[var(--color-highland-500)] hover:bg-[var(--color-highland-800)] text-white py-2 px-4 rounded inline-block">
            Ir al catálogo
          </router-link>
        </div>

        <!-- Tarjetas de productos -->
        <div v-else>
          <ProductCartCard v-for="(cartItem, index) in cartProducts" :key="index" :product="cartItem"
            :cartItem="cartItem" @update-quantity="updateProductQuantity" @remove-product="removeProductFromCart" />
        </div>
      </div>

      <!-- Columna de resumen -->
      <div v-if="totalCost > 0">
        <h2 class="text-2xl font-bold text-gray-600">Resumen de la compra</h2>
        <div class="bg-white shadow-md rounded-lg p-4 relative">
          <p v-if="isOnlyCourses" class="text-sm text-green-500">
            Sin costo de envío
          </p>
          <!-- Mostrar el loader -->
          <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>

          <div class="flex justify-between mb-2">
            <span class="font-semibold">Producto:</span>
            <span>${{ productSubtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-semibold">Envío:</span>
            <span v-if="totalShippingCost > 0">${{ totalShippingCost.toFixed(2) }}</span>
            <span v-else class="text-green-500">¡Gratis!</span>
          </div>

          <div class="flex justify-between border-t pt-2">
            <span class="font-semibold text-lg">Total:</span>
            <span class="text-lg font-bold">${{ totalCost.toFixed(2) }}</span>
          </div>
          <button @click="continueToAddress"
            class="mt-4 bg-[var(--color-highland-500)] hover:bg-[var(--color-highland-800)] cursor-pointer text-white py-2 px-4 rounded w-full text-center block"
            :disabled="loading">
            Continuar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductCartCard from "@/components/Client/Carrito/ProductCartCard.vue";
import CartService from "@/services/CartService";
import { EventBus } from "@/services/eventBus";
import { Products } from "@/interfaces/Products";
import { CartProduct } from "@/interfaces/CartProduct";
// Estado del carrito
const cartProducts = ref<CartProduct[]>([]);
const loading = ref<boolean>(true);
const shippingCost = ref<number>(250); // Envío fijo por ahora

// Subtotal de productos
const productSubtotal = computed(() =>
  cartProducts.value.reduce((sum, product) => sum + product.price * product.cantidad, 0)
);

// Verifica si todos los productos del carrito son cursos
const isOnlyCourses = computed(() =>
  cartProducts.value.every((product) => product.type === "curso")
);

// Costo total de envío
const totalShippingCost = computed(() =>
  isOnlyCourses.value ? 0 : shippingCost.value
);

// Costo total incluyendo productos y envío
const totalCost = computed(() =>
  productSubtotal.value + totalShippingCost.value
);

// Cargar productos del carrito al montar el componente
onMounted(async () => {
  try {
    loading.value = true;
    const cart = await CartService.getCart();

    cartProducts.value = cart as CartProduct[];

    // Emitir evento para actualizar el contador en el Navbar
    EventBus.emit("cart-updated", cartProducts.value);
  } catch (error) {
    console.error("Error al obtener los productos del carrito:", error);
  } finally {
    loading.value = false;
  }
});
const updateProductQuantity = async (cartItemId: number, newQuantity: number) => {
  console.log("Actualizando cantidad - ID recibido:", cartItemId, "Nueva cantidad:", newQuantity);

  if (!cartItemId) {
    console.error("Error: cartItemId es undefined en updateProductQuantity");
    return;
  }

  try {
    loading.value = true;
    const updated = await CartService.updateProductQuantity(cartItemId, newQuantity);

    if (updated) {
      cartProducts.value = cartProducts.value.map((product) =>
        product.carrito_id === cartItemId ? { ...product, cantidad: newQuantity } : product
      );

      localStorage.setItem("cart", JSON.stringify(cartProducts.value));
      EventBus.emit("cart-updated", cartProducts.value);
    } else {
      console.error("Error: No se pudo actualizar la cantidad en el servidor.");
    }
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto:", error);
  } finally {
    loading.value = false;
  }
};
// Eliminar un producto del carrito
// Eliminar un producto del carrito
const removeProductFromCart = async (cartItemId: number) => {
  console.log("Eliminando producto del carrito - ID recibido:", cartItemId);

  if (!cartItemId) {
    console.error("Error: cartItemId es undefined en removeProductFromCart");
    return;
  }

  try {
    loading.value = true;
    const removed = await CartService.removeProduct(cartItemId);

    if (removed) {
      // 🔹 Eliminamos el producto del array reactivo
      cartProducts.value = cartProducts.value.filter((product) => product.carrito_id !== cartItemId);

      // 🔹 Actualizamos `localStorage`
      localStorage.setItem("cart", JSON.stringify(cartProducts.value));

      // 🔹 Emitimos evento para actualizar la UI
      EventBus.emit("cart-updated", cartProducts.value);
    } else {
      console.error("Error: No se pudo eliminar el producto del servidor.");
    }
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
  } finally {
    loading.value = false;
  }
};

// Continuar al paso de dirección
const continueToAddress = async () => {
  try {
    const payload = {
      items: cartProducts.value.map((product) => ({
        productId: product.id,
        name: product.product_name,
        quantity: product.cantidad,
        unitPrice: product.price,
        totalPrice: product.price * product.cantidad,
      })),
      subtotal: productSubtotal.value,
      shippingCost: totalShippingCost.value,
      total: totalCost.value,
      address_id: localStorage.getItem("selectedAddressId"),
    };

    const response = await CartService.createTemporalOrder(payload);

    if (response === 201) {
      window.location.href = "/Address";
    } else {
      console.error("Error al crear la orden temporal:", response);
      alert("Hubo un problema al crear la orden temporal. Intenta de nuevo.");
    }
  } catch (error) {
    console.error("Error al procesar la orden temporal:", error);
    alert("Ocurrió un error al procesar tu orden. Intenta de nuevo.");
  }
};
</script>