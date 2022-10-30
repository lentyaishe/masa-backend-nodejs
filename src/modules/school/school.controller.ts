import { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../../core/request.helper";
import { systemError, whiteBoardType } from "../../entities";
import { ResponseHelper } from "../../framework/response.helper";
import SchoolService from "./school.service";

class SchoolController {

    constructor() { }

    async getBoardTypes(req: Request, res: Response, next: NextFunction) {
        //console.log("User data: ", (req as AuthenticatedRequest).userData);
        SchoolService.getBoardTypes()
            .then((result: whiteBoardType[]) => {
                return res.status(200).json({
                    types: result
                });
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            });
    }

    async getBoardTypeById(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id)
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                SchoolService.getBoardTypeById(numericParamOrError)
                    .then((result: whiteBoardType) => {
                        return res.status(200).json(result);
                    })
                    .catch((error: systemError) => {
                        return ResponseHelper.handleError(res, error);
                    });
            }
            else {
                // TODO: Error handling
            }
        }
        else {
            return ResponseHelper.handleError(res, numericParamOrError);
        }
    }
}

export default new SchoolController();