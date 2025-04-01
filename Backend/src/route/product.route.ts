import { Router } from "express";
import { ProductController } from "../controller/product/product.controller";
import { AdminProductController } from "../controller/product/admin.product.controller";
import { upload } from "../utils/multer.utils";
import { adminGuard, expertGuard, farmerGuard, loginGuard } from "../middleware/login.middleware";
import { platformVerified } from "../middleware/platformVerified.middleware";
import { asyncHandler } from "../middleware/asyncHandler.middleware";

export const productRouter = Router();

const productController = new ProductController();

productRouter.get("/", asyncHandler(productController.getProducts));
productRouter.get("/my-product",loginGuard,productController.getMyProducts);
productRouter.post("/",loginGuard,upload.single("image"),asyncHandler(productController.createProduct));
productRouter.put("/:id",loginGuard,asyncHandler(productController.updateProduct));
productRouter.delete("/:id",loginGuard,farmerGuard,platformVerified,productController.deleteProduct);
productRouter.put("/image/:id",loginGuard,upload.single("image"),asyncHandler(productController.changeProductImage));
productRouter.put("/verify/:id",loginGuard,expertGuard,platformVerified,productController.verifyProduct);
productRouter.post("/unverify/:id",loginGuard,expertGuard,platformVerified,productController.unverifyProduct);
productRouter.post("/review/:id",loginGuard,asyncHandler(productController.postReview));

//ADMIN
const adminProductController = new AdminProductController();
productRouter.get("/admin", adminGuard,adminProductController.getProducts);
productRouter.get("/admin/:id", adminGuard,adminProductController.getProduct);
productRouter.post("/admin", adminGuard,adminProductController.createProduct);
productRouter.put("/admin/:id",adminGuard ,adminProductController.updateProduct);
productRouter.delete("/admin/:id", adminGuard,adminProductController.deleteProduct);
productRouter.put("/admin/image/:id", adminGuard,upload.single("image"),adminProductController.changeProductImage);

