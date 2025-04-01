import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/base.utils";
import { AuthorizedRequest, ROLE, Token } from "../typings/base.type";


const handleUnauthorized = (res: Response, message: string): void => {
   res.status(401).json({ message });
};

const verifyTokenAndRole = (req: AuthorizedRequest, res: Response, next: NextFunction, allowedRoles: ROLE[]) => {
  try {
    
    const token = req.cookies.token;
    if (!token) {
      console.log("No token found");
      return handleUnauthorized(res, "No token found");
    }

    const decoded = verifyJwt(token) as Token | null;
    if (!decoded) {
      console.log("Invalid token");
      return handleUnauthorized(res, "Invalid token");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      console.log(decoded.role, "is not allowed");
      console.log("Forbidden");
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    handleUnauthorized(res, "Unauthorized");
  }
};

export function loginGuard(req: AuthorizedRequest, res: Response, next: NextFunction): void {
  verifyTokenAndRole(req, res, next, []);
}

export function adminGuard(req: AuthorizedRequest, res: Response, next: NextFunction): void {
  verifyTokenAndRole(req, res, next, [ROLE.ADMIN]);
}

export function expertGuard(req: AuthorizedRequest, res: Response, next: NextFunction): void {
  verifyTokenAndRole(req, res, next, [ROLE.ADMIN, ROLE.EXPERT]);
}

export function farmerGuard(req: AuthorizedRequest, res: Response, next: NextFunction): void {
  verifyTokenAndRole(req, res, next, [ROLE.ADMIN, ROLE.FARMER]);
}
