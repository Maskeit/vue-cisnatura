// Definir la interfaz del usuario
export interface User {
    name: string;
    email: string;
    telefono: string;
}
export interface UserList extends User {
    id: number; // ID del usuario
    active: boolean;
    created_at: string; // Fecha de creación del usuario
    updated_at: string; // Fecha de la última actualización del usuario
}
// Definir la interfaz de la respuesta de la API
export interface UserResponse {
    status: number;
    message: string;
    data: User[]; // Un array de usuarios
}

export interface UpdatePhoneReq {
    telefono: string;
}
export interface UpdatePhoneRes {
    status: number;
    message: string;
}

