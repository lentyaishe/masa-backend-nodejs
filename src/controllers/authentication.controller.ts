import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { AuthenticationService } from '../services/authentication.service';
import { authenticationToken, jwtUserData, systemError } from '../entities';
import { ResponseHelper } from '../helpers/response.helper';
import { TOKEN_SECRET } from '../constants';

interface localUser {
    login: string;
    password: string;
}

const authenticationService: AuthenticationService = new AuthenticationService();

const login = async (req: Request, res: Response, next: NextFunction) => {
    const user: localUser = req.body;

    try {
        const userData: jwtUserData = await authenticationService.login(user.login, user.password);

        const authenticationToken: authenticationToken = {
            userData: userData
        };
            
        const token: string = jwt.sign(
            authenticationToken,
            TOKEN_SECRET,
            {
                expiresIn: "2h",
            });

        return res.status(200).json({
            token: token
        });
    }
    catch (error: any) {
        return ResponseHelper.handleError(res, error as systemError, true);
    }
};

export default { login };