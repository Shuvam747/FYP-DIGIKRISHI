import { Request } from "express";
export enum ROLE {
  FARMER = "FARMER",
  GENERAL = "GENERAL",
  ADMIN = "ADMIN",
  EXPERT = "EXPERT",
}
export enum ORDER_STATUS {
  PLACED = "placed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  PENDING="pending",
}
export enum DELIVERY_TYPE {
  DELIVERY = "delivery",
  PICKUP = "pickup",
}
export enum RESOURCE_TYPE {
  PDF = "pdf",
  VIDEO = "video",
  ARTICLE = "article",
}
export enum REQUEST_STATUS{
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum RESOURCE_CATEGORY {
  CROP_TYPE = "croptype",
  SOIL_MANAGEMENT = "soilmanagement",
  PEST_CONTROL = "pestcontrol",
  BUSINESS = "business",

}

export enum PAYMENT_STATUS {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}
export interface Token {
  id: string;
  role: ROLE;
  verified: boolean;
}
export interface AuthorizedRequest extends Request {
  user: Token;
}


