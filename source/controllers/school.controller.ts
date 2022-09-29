import { Request, Response, NextFunction } from 'express';
import { NON_EXISTENT_ID } from '../constants';
import { AuthenticatedRequest, systemError, whiteBoardType } from '../entities';
import { RequestHelper } from '../helpers/request.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { ErrorService } from '../services/error.service';
import { SchoolService } from '../services/school.service';

const errorService: ErrorService = new ErrorService();
const schoolService: SchoolService = new SchoolService(errorService);

const getBoardTypes = async (req: Request, res: Response, next: NextFunction) => {
    console.log("User data: ", (req as AuthenticatedRequest).userData);
    schoolService.getBoardTypes()
        .then((result: whiteBoardType[]) => {
            return res.status(200).json({
                types: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const getBoardTypeById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            schoolService.getBoardTypeById(numericParamOrError)
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
};

const updateBoardTypeById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: whiteBoardType = req.body;

            schoolService.updateBoardTypeById({
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
};

const addBoardType = async (req: Request, res: Response, next: NextFunction) => {
    const body: whiteBoardType = req.body;

    schoolService.addBoardType({
        id: NON_EXISTENT_ID,
        type: body.type
    }, (req as AuthenticatedRequest).userData.userId)
        .then((result: whiteBoardType) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const addBoardTypeByStoredProcedure = async (req: Request, res: Response, next: NextFunction) => {
    const body: whiteBoardType = req.body;

    schoolService.addBoardTypeByStoredProcedure({
        id: NON_EXISTENT_ID,
        type: body.type
    }, (req as AuthenticatedRequest).userData.userId)
        .then((result: whiteBoardType) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const addBoardTypeByStoredProcedureOutput = async (req: Request, res: Response, next: NextFunction) => {
    const body: whiteBoardType = req.body;

    schoolService.addBoardTypeByStoredProcedureOutput({
        id: NON_EXISTENT_ID,
        type: body.type
    }, (req as AuthenticatedRequest).userData.userId)
        .then((result: whiteBoardType) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const deleteBoardTypeById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            schoolService.deleteBoardTypeById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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

// SQL injection made by sending the following as a parameter: <' OR 1=1 -- >
const getBoardTypeByTitle = async (req: Request, res: Response, next: NextFunction) => {
    let title: string = req.params.title;
    
    schoolService.getBoardTypeByTitle(title)
        .then((result: whiteBoardType[]) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

export default { getBoardTypes, getBoardTypeById, getBoardTypeByTitle, updateBoardTypeById, addBoardType, addBoardTypeByStoredProcedure, addBoardTypeByStoredProcedureOutput, deleteBoardTypeById };