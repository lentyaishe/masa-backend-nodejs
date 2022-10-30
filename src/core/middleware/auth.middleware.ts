import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { TOKEN_SECRET } from "../../constants";

class AuthMiddleware {

    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader !== "null") {
            // const token = authHeader.split(" ")[1];
            
            jwt.verify(authHeader, TOKEN_SECRET, (err: any, user: any) => {
                if (err) {
                    return res
                        .status(403)
                        .send({ success: false, message: "Token Expired" });
                }

                next();
            });
        }
        else {
            res.status(403).json({ success: false, message: "Unauthorized" });
        }
    }
}
export default new AuthMiddleware()