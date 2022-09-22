import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { TOKEN_SECRET } from "../constants";

interface AuthenticatedRequest extends Request {
    userId: number;
}

interface jwtBase {
    userId: number;
    exp: number;
    iat: number;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.headers["authorization"]?.toString();

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        // 'Bearer ..............'
        token = token.substring("Bearer ".length);
        const decoded: string | JwtPayload = jwt.verify(token, TOKEN_SECRET);
        (req as AuthenticatedRequest).userId = (decoded as jwtBase).userId;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};

export default { verifyToken };