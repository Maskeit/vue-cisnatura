export interface Products {
    id: number;
    type: string; // categoria del producto
    product_name: string;
    description: string;
    thumb: string; // nombre de imagen del producto
    price: number;
    stock: number; // cantidad de stock
    active: number; // si esta habilitado o no el producto
    created_at: string;
    updated_at: string;
    deleted?: string | null;
}
