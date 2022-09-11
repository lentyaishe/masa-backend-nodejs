import { systemError } from "../entities";

export class ErrorHelper {

    public static createError(code: number, message: string): systemError {
        const error: systemError = {
            code: code,
            message: message
        };
        return error;
    }
}