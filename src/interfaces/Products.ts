export interface Products {
    id: number;
    type: string;
    product_name: string;
    description: string;
    thumb?: string;
    price: number;
    stock: number;
    active: number;
    created_at: string;
    updated_at: string;
    deleted?: string | null;
}