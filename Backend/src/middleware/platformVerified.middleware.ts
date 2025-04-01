import { Request, Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../typings/base.type';
import { User } from '../model/user.model';
export async function platformVerified(req: AuthorizedRequest, res: Response, next: NextFunction) {
    if(req.user?.verified)
      next();
    
    try {
        const user = await User.findById(req.user?.id).select("isVerified");
        if(user?.isVerified){
            req.user.verified = true;
           next();
        }
     res.status(403).json({message: "User not platform verified"});
    } catch (error) {
    res.status(500).json({message: "Internal server error"});
    }
}