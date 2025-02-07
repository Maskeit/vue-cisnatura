export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    telefono: string;
    active: boolean;
    createdAt: Date;
}