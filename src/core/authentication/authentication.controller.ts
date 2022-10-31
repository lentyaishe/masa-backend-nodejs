import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtUserData, systemError, authenticationToken } from "../../entities";
import { ResponseHelper } from "../../framework/response.helper";
import { StaticEnvironment } from "../environment.static";
import AuthenticationService from "./authentication.service";

interface localUser {
    login: string;
    password: string;
}

class Authenticationontroller {

    constructor() { }

    async login(req: Request, res: Response, next: NextFunction) {
        // return res.status(200).json({
        //     success: true
        // });
        const user: localUser = req.body;

        try {
            const userData: jwtUserData = await AuthenticationService.login(user.login, user.password);

            const authenticationToken: authenticationToken = {
                userData: userData
            };

            const token: string = jwt.sign(
                authenticationToken,
                StaticEnvironment.tokenSecret,
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

export default new Authenticationontroller();