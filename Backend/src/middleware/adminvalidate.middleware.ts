import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/base.utils';

export async function validateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const decode = verifyJwt(token) as TokenPayload | null;
        if (!decode) {
            res.status(401).json({ message: "Unauthorized" });
        }

    res.status(200).json({ isAdmin:true});
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ isAdmin:false});
    }
}

interface TokenPayload {
    role: string;
    id: string;
}
