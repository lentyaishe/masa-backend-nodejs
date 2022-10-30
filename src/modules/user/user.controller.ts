import { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../../core/request.helper";
import { AuthenticatedRequest, systemError, user } from "../../entities";
import { ResponseHelper } from "../../framework/response.helper";
import UserService from "./user.service";
import LoggerService from "../../core/logger.service";

class UserController {

    constructor() { }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        LoggerService.debug("getUserById method start");
        const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id);
        
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                LoggerService.debug("getUserById successful return");
                const result: user = await UserService.getById(numericParamOrError);
                return res.status(200).json(result);
            }
            else {
                // TODO: Error handling
                LoggerService.debug("getUserById unhandled error");
            }
        }
        else {
            LoggerService.debug("getUserById failure response");
            return ResponseHelper.handleError(res, numericParamOrError);
        }
        LoggerService.debug("getUserById method end");
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