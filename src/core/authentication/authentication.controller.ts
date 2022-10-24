import { Request, Response, NextFunction } from "express";

class Authenticationontroller {

    constructor() { }

    async login(req: any, res: Response, next: NextFunction) {
        return res.status(200).json({
            success: true
        });
    }
}

export default new Authenticationontroller();