import mongoose, { Schema } from 'mongoose';
import { DELIVERY_TYPE, ORDER_STATUS } from '../typings/base.type';
const orderSchema = new mongoose.Schema({
    product:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quantity:     { type: Number, required: true },
    totalPrice:   { type: Number, required: true },
    orderStatus:  { type: String, enum: ORDER_STATUS, default: ORDER_STATUS.PENDING },
    deliveryType: { type: String, enum: DELIVERY_TYPE, default: DELIVERY_TYPE.DELIVERY },
  }, { timestamps: true });
  
export const Order = mongoose.model('Order', orderSchema);