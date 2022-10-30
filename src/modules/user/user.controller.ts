import { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../../core/request.helper";
import { AuthenticatedRequest, systemError, user } from "../../entities";
import { ResponseHelper } from "../../framework/response.helper";
import UserService from "./user.service";

class UserController {

    constructor() { }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id);
        
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                const result: user = await UserService.getById(numericParamOrError);
                return res.status(200).json(result);
            }
            else {
                // TODO: Error handling
            }
        }
        else {
            return ResponseHelper.handleError(res, numericParamOrError);
        }
    }
    
    async updateById(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id);
        
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                const body: user = req.body;

                UserService.updateById({
                    id: numericParamOrError,
                    firstName: body.firstName,
                    lastName: body.lastName
                }, (req as AuthenticatedRequest).userData.userId)
                    .then((result: user) => {
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

export default new UserController();