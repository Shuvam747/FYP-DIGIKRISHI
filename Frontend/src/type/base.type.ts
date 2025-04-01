export enum DELIVERY_TYPE {
    DELIVERY = "delivery",
    PICKUP = "pickup",
  }
  
  export interface Product {
    _id: string
    name: string
    description: string
    price: number
    quantity: number
    image: string
    isVerified: boolean
    availableForDelivery: boolean
    reviews: Review[]
    seller: {
      _id: string
      username: string
    }
  }
  
  export interface Review {
    _id: string
    rating: number
    comment: string
    user: {
      _id: string
      username: string
    }
  }
  
  export interface Products {
    _id: string
    name: string
    price: number
    quantity: number
    description: string
    image: string
  }
  
  export interface Order {
    _id: string
    createdAt: string
    orderStatus: ORDER_STATUS
    deliveryType: DELIVERY_TYPE
    buyer:{
      email: string
    }
  }
  
  export enum ORDER_STATUS {
    PENDING = "pending",
    PLACED = "placed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
  }
  
  