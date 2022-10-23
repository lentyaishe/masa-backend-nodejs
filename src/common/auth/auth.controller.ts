import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TOKEN_SECRET } from "../../constants";
import { authenticationToken, jwtUserData, systemError } from "../../entities";
import { ResponseHelper } from "../../helpers/response.helper";
import AuthenticationService from "./auth.service";

interface localUser {
    login: string;
    password: string;
}

export class UserController {

    constructor() { }

    async login(req: any, res: Response, next: NextFunction) {
        const user: localUser = req.body;

        try {
            const userData: jwtUserData = await AuthenticationService.login(user.login, user.password);

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
    }
}

export default new UserController();