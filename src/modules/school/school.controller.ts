import { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../../core/request.helper";
import { AuthenticatedRequest, systemError, whiteBoardType } from "../../entities";
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

    async getBoardTypeByTitle(req: Request, res: Response, next: NextFunction) {
        let title: string = req.params.title;
    
        SchoolService.getBoardTypeByTitle(title)
            .then((result: whiteBoardType[]) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            });
    }

    async updateBoardTypeById(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id);
        
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                const body: whiteBoardType = req.body;
    
                SchoolService.updateBoardTypeById({
                    id: numericParamOrError,
                    type: body.type
                }, (req as AuthenticatedRequest).userData.userId)
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