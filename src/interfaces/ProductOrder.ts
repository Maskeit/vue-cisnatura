import { Address } from "@/interfaces/Address";

interface Product {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface ProductOrder {
    id: number;
    payment_intent_id?: string;
    chsession_id?: string;
    userId: string;
    productsData: Product[];
    subtotal: number;
    envio: number;
    total: number;
    status: string;
    customer_email: string;
    payment_status?: string;
    payment_method?: string;
    envio_status: string;
    address: Address[];
    created_at: string;
    updated_at: string;
}
export interface Envios {
    id: number;
    order_id: number;
    devuelto: number;
    envio_status: string;
    notas: string;
    created_at: string;
    updated_at: string;
}

export type OrderStatus = "complete" | "pending" | "accepted" | "canceled";
export type ShippingStatus = "delivered" | "in_process" | "in_transit" | "returned";