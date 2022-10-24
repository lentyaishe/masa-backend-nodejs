import { Dictionary } from "underscore";
import { systemError } from "../entities";
import { AppError } from "../enums";

interface IErrorService {
    getError(key: AppError): systemError;
}

class ErrorService implements IErrorService {
    private _error: Dictionary<systemError> = {};

    constructor() {
        this.initializeErrors();
    } 

    public getError(key: AppError): systemError {
        return this._error[key];
    }

    private initializeErrors() {
        this._error[AppError.General] = {
            key: AppError.General,
            code: 99,
            message: "General error. DEBUG me!!!"
        };

        this._error[AppError.ConnectionError] = {
            key: AppError.ConnectionError,
            code: 100,
            message: "DB server connection error"
        };

        this._error[AppError.QueryError] = {
            key: AppError.QueryError,
            code: 101,
            message: "Incorrect query"
        };

        this._error[AppError.NoData] = {
            key: AppError.NoData,
            code: 102,
            message: "Not found"
        };

        this._error[AppError.NonNumericInput] = {
            key: AppError.NonNumericInput,
            code: 103,
            message: "Non numeric input supplied"
        };

        this._error[AppError.InputParameterNotSupplied] = {
            key: AppError.InputParameterNotSupplied,
            code: 104,
            message: "Input parameter not supplied"
        };

        this._error[AppError.DeletionConflict] = {
            key: AppError.DeletionConflict,
            code: 105,
            message: "Delete failed due to conflict"
        };
    }
}

export default new ErrorService();