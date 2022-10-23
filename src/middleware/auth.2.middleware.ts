import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TOKEN_SECRET } from "../constants";
import { Role } from "../enums";
import { AuthenticatedRequest, jwtUserData } from "../entities";

interface jwtBase {
    userData: jwtUserData;
    exp: number;
    iat: number;
}

class Middleware {

    public verifyToken = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(403).send("A token is required for authentication");
        }

        try {
            // 'Bearer ..............'
            const token: string = authHeader.substring("Bearer ".length);
            const decoded: string | JwtPayload = jwt.verify(token, TOKEN_SECRET);
            if (roles.indexOf((decoded as jwtBase).userData.roleId) === -1) {
                return res.sendStatus(401);
            }
            (req as AuthenticatedRequest).userData = (decoded as jwtBase).userData;

            return next();
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
}

export default new Middleware()