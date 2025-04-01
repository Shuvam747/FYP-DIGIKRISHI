import { Request, Response, NextFunction } from "express";
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
}

export class invalidInputError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

export class permissionNotGranted extends Error {
  statusCode = 403;
  constructor(message: string) {
    super(message);
  }
}

export class resourceNotFound extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
  }
}
