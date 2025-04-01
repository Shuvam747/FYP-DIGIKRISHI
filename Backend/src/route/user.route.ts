import { Router } from "express";
import { UserController } from "../controller/user/user.controller";
import { AdminUserController } from "../controller/user/admin.user.controller";
import { adminGuard, loginGuard } from "../middleware/login.middleware";
import { upload } from "../utils/multer.utils";
import { asyncHandler } from "../middleware/asyncHandler.middleware";

export const userRouter = Router();

const userController = new UserController();
userRouter.get("/", loginGuard,asyncHandler(userController.getUser));
userRouter.delete("/", loginGuard,userController.deleteUser);
userRouter.put("/",loginGuard,userController.updateUser);
userRouter.put("/change-email", loginGuard,userController.changeEmail);
userRouter.put("/verify-email", loginGuard,userController.verifyEmail);
userRouter.put("/resend-verification", loginGuard,userController.resendVerification);
userRouter.put("/resend-phone-verification", loginGuard,userController.resendPhoneVerification);
userRouter.put("/change-phone", loginGuard,userController.changeNumber);
userRouter.post("/verify-phone", loginGuard,userController.verifyNumber);
userRouter.post("/platform-verify", loginGuard,upload.single("file"),asyncHandler(userController.platformVerify));
userRouter.put("/change-profile", loginGuard,upload.single("image"),asyncHandler(userController.changeProfile));

// ADMIN  
const adminUserController = new AdminUserController();
userRouter.get("/admin/",adminGuard,adminUserController.getUsers);
userRouter.put("/admin/:id",adminGuard,adminUserController.updateUser);
userRouter.delete("/admin/:id",adminGuard,userController.deleteUser);
userRouter.get("/admin/verifyRequest/:id",adminGuard,asyncHandler(adminUserController.verifyRequest));
userRouter.get("/admin/verifyRequestFromStatus",adminGuard,asyncHandler(adminUserController.verifyRequests));
userRouter.put("/admin/verifyRequest/:id",adminGuard,asyncHandler(adminUserController.updateVerifyRequest));
userRouter.put("/admin/declineRequest/:id",adminGuard,asyncHandler(adminUserController.declineRequest));



