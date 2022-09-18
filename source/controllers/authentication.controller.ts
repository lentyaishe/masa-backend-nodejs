import { Request, Response, NextFunction } from 'express';
import { ErrorService } from '../services/error.service';
import { AuthenticationService } from '../services/authentication.service';
import { systemError } from '../entities';
import { ResponseHelper } from '../helpers/response.helper';

interface localUser {
    login: string;
    password: string;
}

const errorService: ErrorService = new ErrorService();
const authenticationService: AuthenticationService = new AuthenticationService(errorService);

const login = async (req: Request, res: Response, next: NextFunction) => {
    const user: localUser = req.body;

    authenticationService.login(user.login, user.password)
        .then((id: number) => {
            // TODO: Generate JWT token
            const token: string = "1";
            return res.status(200).json({
                token: token
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error, true);
        });
};

export default { login };