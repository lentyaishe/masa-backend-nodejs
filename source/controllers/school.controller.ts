import { Request, Response, NextFunction } from 'express';
import { ErrorCodes, ErrorMessages } from '../constants';
import { systemError, whiteBoardType } from '../entities';
import { ErrorHelper } from '../helpers/error.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { SchoolService } from '../services/school.service';

const schoolService: SchoolService = new SchoolService();

const getBoardTypes = async (req: Request, res: Response, next: NextFunction) => {
    schoolService.getBoardTypes()
        .then((result: whiteBoardType[]) => {
            return res.status(200).json({
                message: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const getBoardTypeById = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = -1;

    const sId: string = req.params.id;
    if (isNaN(Number(sId))) {
        const nonNumericError: systemError = ErrorHelper.createError(ErrorCodes.NonNumericInput, ErrorMessages.NonNumericInput);
        return ResponseHelper.handleError(res, nonNumericError);
    }

    if (sId !== null && sId !== undefined) {
        id = parseInt(sId);
    }
    else {
        const noInputParameteterError: systemError = ErrorHelper.createError(ErrorCodes.InputParameterNotSupplied, ErrorMessages.InputParameterNotSupplied);
        return ResponseHelper.handleError(res, noInputParameteterError);
    }

    
    
    if (id > 0) {
        schoolService.getBoardTypeById(id)
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

export default { getBoardTypes, getBoardTypeById, getBoardTypeByTitle };