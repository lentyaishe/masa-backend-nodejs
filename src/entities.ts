import { Request } from 'express';
import { AppError, Role, Status } from "./enums";

export interface entityWithId {
    id: number;
}

export interface entityBase extends entityWithId {
    createDate?: string;
    updateDate?: string;
    createUser?: user;
    updateUser?: user;
    statusId?: Status;
}

export interface whiteBoardType extends entityBase {
    type: string;
    createUserId?: number; // backward compatibility
    updateUserId?: number; // backward compatibility
}

export interface classRoom extends entityBase {
    roomNumber: number;
    roomFloor: number;
    hasProjector: boolean;
    whiteBoardType: whiteBoardType;
}

export interface teacher extends entityWithId {
    firstName: string;
    lastName: string;
    birthdate: Date;
    isMale: boolean;
    graduations: teacherGradution[];
}

export interface profession extends entityWithId {
    title: string;
}

export interface teacherGradution {
    profession: profession;
    graduationYear: number;
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

export interface authenticationToken {
    userData: jwtUserData;
}

export interface jwtUserData {
    userId: number;
    roleId: Role;
}

export interface AuthenticatedRequest extends Request, authenticationToken { }

export interface user extends entityWithId {
    firstName: string;
    lastName: string;
    login?: string;
    password?: string;
    createDate?: string;
    updateDate?: string;
    createUser?: number;
    updateUser?: number;
    statusId?: number;
}

export interface status extends entityWithId {
    statusName: string;
}

export interface environment {
    dbConnectionString: string;
    tokenSecret: string;
    logsFolder: string;
    serverPort: number;
}