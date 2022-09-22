import { AppError, Role } from "./enums";

export interface entityWithId {
    id: number;
}

export interface whiteBoardType extends entityWithId {
    type: string;
}

export interface systemError {
    key: AppError;
    code: number;
    message: string;
}

export interface sqlParameter {
    name: string;
    type: any;
    value: string | number;
}

export interface jwtUserData {
    userId: number;
    roleId: Role;
}
