import { Schema, model, Document } from 'mongoose';
import { PAYMENT_STATUS } from '../typings/base.type';
const paymentSchema = new Schema({
    MerchantCode: {
        type: String,
        required: true,
    },
    TranAmount: {
        type: Number,
        required: true,
    },
    TransactionUuid: {
        type: String,
        required: true,
    },
    ProductCode: {
        type: String,
        required: true,
    },
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ItemId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    Status: {
        type: String,
        enum:Object.values(PAYMENT_STATUS),
        required: true,
    },
    OrderId:{
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
    }
})

export const Payment = model('Payment', paymentSchema);