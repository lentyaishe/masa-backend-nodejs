import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { AuthenticatedRequest, jwtUserData } from "../../entities";
import { Role } from "../../enums";
import { StaticEnvironment } from "../environment.static";

interface jwtBase {
    userData: jwtUserData;
    exp: number;
    iat: number;
}

class AuthMiddleware {

    public verifyToken = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined = req.headers["authorization"]?.toString();

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
    
        try {
            // 'Bearer ..............'
            token = token.substring("Bearer ".length);
            const decoded: string | JwtPayload = jwt.verify(token, StaticEnvironment.tokenSecret);
            if (roles.indexOf((decoded as jwtBase).userData.roleId) === -1) {
                return res.sendStatus(401);
            }
            (req as AuthenticatedRequest).userData = (decoded as jwtBase).userData;
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    
        return next();
    }
}

export default new AuthMiddleware();