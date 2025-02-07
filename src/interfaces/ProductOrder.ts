import { Address } from "@/interfaces/Address";
import { Products } from "@/interfaces/Products"; // Si tienes una interfaz de Producto

export interface ProductOrder {
    id: number;
    payment_intent_id?: string;
    chsession_id?: string;
    userId: string;
    products: Products[]; // ✅ Ahora es un array de objetos, no un string[]
    subtotal: number;
    shippingCost: number; // ✅ Cambiado de "envio" a "shippingCost"
    total: number;
    order_status: string;
    customer_email: string;
    payment_status?: string;
    payment_method?: string;
    address: Address[]; // ✅ Ahora es un array, en lugar de un `address_id`
    created_at: string;
    updated_at: string;
}