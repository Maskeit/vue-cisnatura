<template>
    <div @click="$emit('click', product)"
        class="product-card bg-white w-56 shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
        data-product-id="product.id">
        <!-- Imagen -->
        <div class="w-full bg-white">
            <img :src="`http://cisnaturatienda.local/app/pimg/${product.thumb}`" :alt="product.product_name"
                class="w-full  object-contain p-4" />
        </div>

        <!-- Información del Producto -->
        <div class="p-4">
            <h3 class="text-lg font-bold text-center text-gray-800">
                {{ product.product_name }}
            </h3>
            <p class="text-gray-600 text-sm text-center mt-2 line-clamp-1" :title="product.description"
                v-html="product.description"></p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span class="text-md font-semibold text-gray-800">
                ${{ product.price }} MX
            </span>
            <button @click.stop="handleAddToCart"
                class="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full shadow flex items-center gap-1">
                <template v-if="addedToCart">
                    <span>✓</span>
                    <span>Agregado</span>
                </template>
                <template v-else>
                    <span>Añadir</span>
                    <ShoppingCartIcon class="h-5 w-5 text-gray-800" />
                </template>
            </button>
        </div>


    </div>
</template>

<script>
import { ShoppingCartIcon } from "@heroicons/vue/24/outline";
import CartService from "@/services/CartService";
import { EventBus } from "@/services/eventBus";

export default {
    name: "ProductCard",
    components: { ShoppingCartIcon },
    props: {
        product: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            addedToCart: false, // Estado temporal para mostrar el mensaje de éxito
        };
    },
    methods: {
        async handleAddToCart() {
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
                const response = await CartService.addProduct(this.product.id, 1);
                if (response === 201) {
                    // Actualizar el carrito localmente
                    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

                    // Buscar si el producto ya existe en el carrito
                    const existingProduct = cart.find((item) => item.product_id === this.product.id);

                    if (existingProduct) {
                        // Incrementar la cantidad si el producto ya existe
                        existingProduct.cantidad += 1;
                    } else {
                        // Si el producto no existe, agregarlo al carrito
                        cart.push({
                            product_id: this.product.id,
                            product_name: this.product.product_name,
                            cantidad: 1,
                            price: this.product.price,
                            thumb: this.product.thumb,
                        });
                    }

                    // Guardar el carrito actualizado en localStorage
                    localStorage.setItem("cart", JSON.stringify(cart));

                    // Emitir evento para actualizar el contador del carrito en el Navbar
                    EventBus.emit("cart-updated", cart);
                    // Mostrar estado temporal en el botón
                    this.addedToCart = true;
                    setTimeout(() => {
                        this.addedToCart = false;
                    }, 2000); // Ocultar el estado después de 2 segundos
                }
            } catch (error) {
                console.error("Error al agregar al carrito:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Estilo adicional si se necesita */
@media (width<500px) {
    .product-card {
        min-width: calc(100% - 2rem);
    }
}
</style>