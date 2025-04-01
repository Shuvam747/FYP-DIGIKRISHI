import { Router } from "express";

import { loginGuard } from "../middleware/login.middleware";
import { AuthController } from "../controller/auth/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler.middleware";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login",asyncHandler(authController.login))
authRouter.post("/register",asyncHandler(AuthController.register))
authRouter.put("/logout",loginGuard,asyncHandler(authController.logout))
authRouter.post("/forgot-password",authController.forgotPassword)
authRouter.put("/reset-password",authController.resetPassword)
authRouter.put("/change-password",loginGuard,authController.changePassword)
authRouter.put("/verify-email",authController.verifyEmail)
authRouter.post("/resend-verification",authController.resendVerification)
authRouter.post("/verify-password-reset",authController.verifyPasswordReset)

authRouter.post("/admin/login",asyncHandler(authController.adminLogin))