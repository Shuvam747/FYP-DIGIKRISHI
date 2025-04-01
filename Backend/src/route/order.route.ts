import { Router } from "express";
import { createOrder, getOrders, getOrdersFromProduct, handleEsewaCallback, handleEsewaCreate, updateOrder } from "../controller/order/order.controller";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { loginGuard } from "../middleware/login.middleware";

export const orderRouter = Router();

orderRouter.post("/",loginGuard,asyncHandler(createOrder))
orderRouter.get("/esewa/callback", asyncHandler(handleEsewaCallback));
orderRouter.get("/",loginGuard,asyncHandler(getOrders))
orderRouter.get("/:productId",loginGuard,asyncHandler(getOrdersFromProduct))
orderRouter.put("/:orderId",loginGuard,asyncHandler(updateOrder))