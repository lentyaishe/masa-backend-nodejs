import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { ErrorService } from '../services/error.service';
import { AuthenticationService } from '../services/authentication.service';
import { jwtUserData, systemError } from '../entities';
import { ResponseHelper } from '../helpers/response.helper';
import { TOKEN_SECRET } from '../constants';

interface localUser {
    login: string;
    password: string;
}

const errorService: ErrorService = new ErrorService();
const authenticationService: AuthenticationService = new AuthenticationService(errorService);

const login = async (req: Request, res: Response, next: NextFunction) => {
    const user: localUser = req.body;

    authenticationService.login(user.login, user.password)
        .then((userData: jwtUserData) => {

            const token: string = jwt.sign(
                userData,
                TOKEN_SECRET,
                {
                    expiresIn: "2h",
                });

            return res.status(200).json({
                token: token
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error, true);
        });
};

export default { login };