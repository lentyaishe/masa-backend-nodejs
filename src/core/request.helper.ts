import { NON_EXISTENT_ID } from "../constants";
import { systemError } from "../entities";
import { AppError } from "../enums";
import ErrorService from "./error.service";

export class RequestHelper {

    public static ParseNumericInput(input: string): number | systemError {
        let result: number = NON_EXISTENT_ID;

        if (isNaN(Number(input))) {
            return ErrorService.getError(AppError.NonNumericInput);
        }

        if (input !== null && input !== undefined) {
            result = parseInt(input);
        }
        else {
            return ErrorService.getError(AppError.InputParameterNotSupplied);
        }

        return result;
    }
}