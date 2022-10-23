import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { TableNames } from "../../db-entities";
import { AuthenticatedRequest, systemError, user } from "../../entities";
import { RequestHelper } from "../../helpers/request.helper";
import { ResponseHelper } from "../../helpers/response.helper";
import DbService from "../../common/db.service";
import UserService from "./user.service";
import { NON_EXISTENT_ID } from "../../constants";

export class UserController {

    constructor() { }

    async getById(req: any, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id)
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                const result: user = await DbService.getFromTableById(TableNames.User, numericParamOrError);
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

    async add(req: Request, res: Response, next: NextFunction) {
        const body: user = req.body;

        const hashedPassword: string = bcrypt.hashSync(body.password as string);

        UserService.add({
            id: NON_EXISTENT_ID,
            firstName: body.firstName,
            lastName: body.lastName,
            login: body.login,
            password: hashedPassword
        }, (req as AuthenticatedRequest).userData.userId)
            .then((result: user) => {
                const returnedUser: user = {
                    id: result.id,
                    firstName: result.firstName,
                    lastName: result.lastName
                };
                return res.status(200).json(returnedUser);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            });
    }
}

export default new UserController();