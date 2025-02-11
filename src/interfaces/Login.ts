// 📌 Datos enviados al servidor para el login
export interface LoginRequest {
    email: string;
    password: string;
}

// 📌 Datos que devuelve el servidor en la respuesta
export interface LoginResponse {
    status: number;
    message?: string;
    data?: {
        token: string;
    };
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    status: number;
    message: string;
}

export interface LogoutResponse {
    status: number;
    message: string;
}

export interface RecoverPasswordRequest {
    email: string;
}

export interface RecoverPasswordResponse {
    status: number;
    message: string;
}

export interface RecoverPasswordDataRequest {
    email: string;
    password: string;
    token: string;
}

export interface RecoverPasswordDataResponse {
    status: number;
    message: string;
}