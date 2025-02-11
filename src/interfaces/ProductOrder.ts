import { Address } from "@/interfaces/Address";
import { Products } from "@/interfaces/Products"; // Si tienes una interfaz de Producto

export interface ProductOrder {
    id: number;
    payment_intent_id?: string;
    chsession_id?: string;
    userId: string;
    products: Products[];
    subtotal: number;
    shippingCost: number;
    total: number;
    order_status: string;
    customer_email: string;
    payment_status?: string;
    payment_method?: string;
    address: Address[];
    created_at: string;
    updated_at: string;
}