import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export function encryptPassword(password: string) {
  try {
    return bcrypt.hashSync(password, 10);
  } catch (error) {
    throw new Error(error);
  }
}

export function comparePassword(password: string, hash: string) {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    throw new Error(error);
  }
}

export function createJwt(payload: object): string {
  const JWT_EXPIRATION_TIME = "6h";
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION_TIME });
}

export function verifyJwt(token: string): object | string {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function generateOTP(length: number): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}
