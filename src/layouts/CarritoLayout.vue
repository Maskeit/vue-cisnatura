<template>
    <div class="container mx-auto px-4 py-6">
        <!-- Estructura del layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Columna de productos -->
            <div class="lg:col-span-2">
                <h2 class="text-2xl font-bold text-gray-600">Productos del carrito</h2>

                <!-- Mostrar mensaje si el carrito está vacío -->
                <div v-if="cartProducts.length === 0" class="text-center py-10">
                    <p class="text-gray-500">No hay productos en tu carrito.</p>
                </div>
                <!-- Tarjetas de productos -->
                <ProductCartCard v-for="(product, index) in cartProducts" :key="index" :product="product"
                    @update-quantity="updateProductQuantity" @remove-product="removeProductFromCart" />
            </div>

            <!-- Columna de resumen -->
            <div>
                <h2 class="text-2xl font-bold text-gray-600">Resumen de la compra</h2>
                <div class="bg-white shadow-md rounded-lg p-4 relative">
                    <!-- Mostrar el loader -->
                    <div v-if="loading"
                        class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>

                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Producto:</span>
                        <span>${{ productSubtotal.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Envío:</span>
                        <span>${{ shippingCost.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between border-t pt-2">
                        <span class="font-semibold text-lg">Total:</span>
                        <span class="text-lg font-bold">${{ totalCost.toFixed(2) }}</span>
                    </div>
                    <router-link to="/Address"
                        class="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full text-center block">
                        Continuar
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCartCard from "../components/ProductCartCard.vue";
import CartService from "../services/CartService.js";
import { EventBus } from "@/services/eventBus";

export default {
    components: {
        ProductCartCard,
    },
    data() {
        return {
            cartProducts: [], // Aquí se llenarán los productos del carrito
            loading: true, // Controla el estado de carga
            shippingCost: 250, // Envío fijo por ahora
        };
    },
    computed: {
        productSubtotal() {
            return this.cartProducts.reduce(
                (sum, product) => sum + product.price * product.cantidad,
                0
            );
        },
        totalCost() {
            return this.productSubtotal + this.shippingCost;
        },
    },
    async mounted() {
        try {
            // Traer productos del carrito
            const cart = await CartService.getCart();
            this.cartProducts = cart; // Guardar productos en el estado
            // Emitir evento para actualizar el contador del carrito en el Navbar
            EventBus.emit("cart-updated", cart);
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false; // Deshabilitar loader
        }
    },
    methods: {
        async updateProductQuantity(productId, newQuantity) {
            try {
                this.loading = true; // Mostrar el loader en la columna de resumen
                const updated = await CartService.updateProductQuantity(productId, newQuantity);
                if (updated) {
                    // Si el servidor actualizó correctamente, actualiza en local
                    const productIndex = this.cartProducts.findIndex(
                        (product) => product.productId === productId
                    );
                    if (productIndex !== -1) {
                        this.cartProducts[productIndex].cantidad = newQuantity;
                        localStorage.setItem("cart", JSON.stringify(this.cartProducts));
                        EventBus.emit("cart-updated", this.cartProducts);
                    }
                } else {
                    console.error("Error: No se pudo actualizar la cantidad en el servidor.");
                }
            } catch (error) {
                console.error("Error al actualizar la cantidad del producto:", error);
            } finally {
                this.loading = false; // Ocultar el loader
            }
        },
        async removeProductFromCart(productId) {
            try {
                this.loading = true; // Mostrar el loader mientras se procesa la eliminación

                const removed = await CartService.removeProduct(productId);

                if (removed) {
                    // Actualizar el DOM eliminando el producto
                    this.cartProducts = this.cartProducts.filter(
                        (product) => product.productId !== productId
                    );
                    // Actualizar el localStorage con los productos restantes
                    localStorage.setItem("cart", JSON.stringify(this.cartProducts));

                    // Emitir evento global con la lista actualizada
                    EventBus.emit("cart-updated", this.cartProducts);
                    return true;
                } else {
                    console.error("Error: No se pudo eliminar el producto del servidor.");
                }
            } catch (error) {
                console.error("Error al eliminar el producto del carrito:", error);
            } finally {
                this.loading = false; // Ocultar el loader
            }
        }
    },
};
</script>