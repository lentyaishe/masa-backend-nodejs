import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from 'express';
import { NON_EXISTENT_ID } from '../constants';
import { TableNames } from "../db-entities";
import { AuthenticatedRequest, systemError, user } from '../entities';
import { RequestHelper } from '../helpers/request.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { DbService } from "../services/db.service";
import { ErrorService } from '../services/error.service';
import { UserService } from '../services/user.service';

const errorService: ErrorService = new ErrorService();
const userService: UserService = new UserService(errorService);
const dbService: DbService = new DbService(errorService);

const getById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const result: user = await dbService.getFromTableById(TableNames.User, numericParamOrError);
            return res.status(200).json(result);
        }
        else {
            // TODO: Error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
};

const add = async (req: Request, res: Response, next: NextFunction) => {
    const body: user = req.body;

    const hashedPassword: string = bcrypt.hashSync(body.password as string);

    userService.add({
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
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: user = req.body;

            userService.updateById({
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
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            userService.deleteById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                .then(() => {
                    return res.sendStatus(200);
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
};

export default { getById, add, updateById, deleteById };