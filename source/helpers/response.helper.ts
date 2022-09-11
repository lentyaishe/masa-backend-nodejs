import { Response } from 'express';
import { ErrorCodes } from '../constants';
import { systemError } from '../entities';

export class ResponseHelper {

    public static handleError(response: Response, error: systemError): Response<any, Record<string, any>> {
        switch (error.code) {
            case ErrorCodes.ConnectionError:
                return response.status(408).json({
                    errorMessage: error.message
                });
            case ErrorCodes.QueryError:
            case ErrorCodes.NonNumericInput:
                return response.status(406).json({
                    errorMessage: error.message
                });
            case ErrorCodes.NoData:
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