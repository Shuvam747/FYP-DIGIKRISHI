import { Router } from "express";
import { ProductController } from "../controller/product/product.controller";
import { AdminProductController } from "../controller/product/admin.product.controller";
import { upload } from "../utils/multer.utils";
import { adminGuard, expertGuard, farmerGuard, loginGuard } from "../middleware/login.middleware";
import { platformVerified } from "../middleware/platformVerified.middleware";
import { asyncHandler } from "../middleware/asyncHandler.middleware";

export const productRouter = Router();

const productController = new ProductController();
const adminProductController = new AdminProductController();

// Public routes
productRouter.get("/", asyncHandler(productController.getProducts));

// Authenticated user routes
productRouter.get("/my-product", loginGuard, asyncHandler(productController.getMyProducts));
productRouter.post("/", loginGuard, upload.single("image"), asyncHandler(productController.createProduct));
productRouter.put("/:id", loginGuard, asyncHandler(productController.updateProduct));
productRouter.delete("/:id", loginGuard, farmerGuard, platformVerified, asyncHandler(productController.deleteProduct));
productRouter.put("/image/:id", loginGuard, upload.single("image"), asyncHandler(productController.changeProductImage));
productRouter.post("/review/:id", loginGuard, asyncHandler(productController.postReview));

// Expert routes
productRouter.put("/verify/:id", loginGuard, expertGuard, platformVerified, asyncHandler(productController.verifyProduct));
productRouter.post("/unverify/:id", loginGuard, expertGuard, platformVerified, asyncHandler(productController.unverifyProduct));

// Admin routes
productRouter.get("/admin", adminGuard, asyncHandler(adminProductController.getProducts));
productRouter.get("/admin/:id", adminGuard, asyncHandler(adminProductController.getProduct));
productRouter.post("/admin", adminGuard, upload.single("image"), asyncHandler(adminProductController.createProduct));
productRouter.put("/admin/:id", adminGuard, asyncHandler(adminProductController.updateProduct));
productRouter.delete("/admin/:id", adminGuard, asyncHandler(adminProductController.deleteProduct));
productRouter.put("/admin/image/:id", adminGuard, upload.single("image"), asyncHandler(adminProductController.changeProductImage));