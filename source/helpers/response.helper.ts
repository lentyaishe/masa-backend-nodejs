import { Response } from 'express';
import { systemError } from '../entities';
import { AppError } from '../enums';

export class ResponseHelper {

    public static handleError(response: Response, error: systemError): Response<any, Record<string, any>> {
        switch (error.key) {
            case AppError.ConnectionError:
                return response.status(408).json({
                    errorMessage: error.message
                });
            case AppError.QueryError:
            case AppError.NonNumericInput:
                return response.status(406).json({
                    errorMessage: error.message
                });
            case AppError.NoData:
                return response.status(404).json({
                    errorMessage: error.message
                });
            default:
                return response.status(400).json({
                    errorMessage: error.message
                });
        }
    }
}