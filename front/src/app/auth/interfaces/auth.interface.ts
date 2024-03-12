export interface UserLogin {
    email: string;
    passwd: string;
}

export interface UserRegsitro {
    email: string;
    nombre: string;
    passwd: string;
}

export interface NombreCompleto {
    nombre: string;
    ap1: string;
    ap2: string;
}

export interface Auth {
    success: boolean;
    data: {
        id: number;
        nombre: string;
        token: string;
    }
    msg: string;
}

export interface RegistroResponse {
    success: boolean;
    msg: string;
}

export interface SolicitarRecPasswdResponse {
    success: boolean;
    id: number;
    msg: string;
}

export interface RecPasswdResponse {
    success: boolean;
    msg: string;
}