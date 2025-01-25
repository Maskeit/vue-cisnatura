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
                        class="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-block">
                        Ir al catálogo
                    </router-link>
                </div>

                <!-- Tarjetas de productos -->
                <div v-else>
                    <ProductCartCard v-for="(product, index) in cartProducts" :key="index" :product="product"
                        @update-quantity="updateProductQuantity" @remove-product="removeProductFromCart" />
                </div>
            </div>

            <!-- Columna de resumen -->
            <div v-if="totalCost > 0">
                <h2 class="text-2xl font-bold text-gray-600">Resumen de la compra</h2>
                <div class="bg-white shadow-md rounded-lg p-4 relative">
                    <p v-if="isOnlyCourses" class="text-sm text-green-500">
                        ¡El envío es gratis porque tu carrito solo contiene cursos!
                    </p>
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
                        <span v-if="totalShippingCost > 0">${{ totalShippingCost.toFixed(2) }}</span>
                        <span v-else class="text-green-500">¡Gratis!</span>
                    </div>

                    <div class="flex justify-between border-t pt-2">
                        <span class="font-semibold text-lg">Total:</span>
                        <span class="text-lg font-bold">${{ totalCost.toFixed(2) }}</span>
                    </div>
                    <button @click="continueToAddress"
                        class="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full text-center block"
                        :disabled="loading">
                        Continuar
                    </button>
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
        // Subtotal de productos
        productSubtotal() {
            return this.cartProducts.reduce(
                (sum, product) => sum + product.price * product.cantidad,
                0
            );
        },
        // Verifica si todos los productos del carrito son cursos
        isOnlyCourses() {
            return this.cartProducts.every((product) => product.type === "curso");
        },
        // Costo total de envío
        totalShippingCost() {
            // Si todos los productos son cursos, el envío es 0
            return this.isOnlyCourses ? 0 : this.shippingCost;
        },
        // Costo total incluyendo productos y envío
        totalCost() {
            return this.productSubtotal + this.totalShippingCost;
        },
    },
    async mounted() {
        try {
            this.loading = true; // Mostrar el loader
            const cart = await CartService.getCart();

            if (!cart || cart.length === 0) {
                this.cartProducts = []; // Si no hay productos, asigna un array vacío
            } else {
                this.cartProducts = cart; // Guardar productos en el estado
            }

            // Emitir evento para actualizar el contador del carrito en el Navbar
            EventBus.emit("cart-updated", this.cartProducts);
        } catch (error) {
            console.error("Error al obtener los productos del carrito:", error);
        } finally {
            this.loading = false; // Ocultar el loader
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
        },
        async continueToAddress() {
            try {
                // Crear el payload con los datos del carrito
                const payload = {
                    items: this.cartProducts.map((product) => ({
                        productId: product.productId,
                        name: product.product_name,
                        quantity: product.cantidad,
                        unitPrice: product.price,
                        totalPrice: product.price * product.cantidad,
                    })),
                    subtotal: this.productSubtotal, // Subtotal de los productos
                    shippingCost: this.totalShippingCost, // Costo de envío (0 si solo hay cursos)
                    total: this.totalCost, // Subtotal + envío
                    address_id: localStorage.getItem("selectedAddressId")
                };

                // Llamar al método createTemporalOrder del servicio
                const response = await CartService.createTemporalOrder(payload);

                // Verificar si la respuesta fue exitosa
                if (response && response === 201) {
                    // Redirigir a la página de direcciones
                    this.$router.push("/Address");
                } else {
                    console.error("Error al crear la orden temporal:", response?.message || "Sin detalles");
                    alert("Hubo un problema al crear la orden temporal. Intenta de nuevo.");
                }
            } catch (error) {
                console.error("Error al procesar la orden temporal:", error);
                alert("Ocurrió un error al procesar tu orden. Intenta de nuevo.");
            }
        }
    },
};
</script>