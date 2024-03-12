export interface UserInfo {
    id: string;
    nombre: string;
    gSanguineo: string;
    nDonante: number;
    dni: string;
    codSeguridad: string;
}


export interface FetchUserInfoResponse {
    success: boolean;
    data: UserInfo;
    msg: string;
}


export interface fetchUsersResponse {
    success: boolean;
    data: UserInfo[];
    msg: string;
}

export interface UpdateUserResponse {
    success: boolean;
    msg: string;
}