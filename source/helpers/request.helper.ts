import { ErrorCodes, ErrorMessages, NON_EXISTENT_ID } from "../constants";
import { systemError } from "../entities";
import { ErrorHelper } from "./error.helper";

export class RequestHelper {

    public static ParseNumericInput(input: string): number | systemError {
        let result: number = NON_EXISTENT_ID;

        if (isNaN(Number(input))) {
            return ErrorHelper.createError(ErrorCodes.NonNumericInput, ErrorMessages.NonNumericInput);
        }

        if (input !== null && input !== undefined) {
            result = parseInt(input);
        }
        else {
            return ErrorHelper.createError(ErrorCodes.InputParameterNotSupplied, ErrorMessages.InputParameterNotSupplied);
        }

        return result;
    }
}