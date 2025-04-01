import { Request, Response, NextFunction } from "express";

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return function (req: Request, res: Response, next: NextFunction): void {
    fn(req, res, next).catch(next);
  };
}
