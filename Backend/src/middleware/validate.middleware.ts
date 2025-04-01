import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/base.utils';

export async function validate(req: Request, res: Response, next: NextFunction){
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const decode = verifyJwt(token);
        if (!decode) {
            res.status(401).json({ message: "Unauthorized" });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized" });
    }
}
