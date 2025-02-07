import { Carrito } from "./Carrito";
import { Products } from "./Products";

// ✅ Extiende ambas interfaces para combinar sus propiedades
export interface CartProduct extends Products, Carrito {}