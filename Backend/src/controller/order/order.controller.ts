import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import { AuthorizedRequest, ORDER_STATUS, PAYMENT_STATUS } from '../../typings/base.type';
import { Response ,Request} from 'express';
import { User } from '../../model/user.model';
import { Product } from '../../model/product.model';
import { invalidInputError } from '../../middleware/errorHandler.middleware';
import { Payment } from '../../model/payment.model';
import { Order } from '../../model/order.model';
dotenv.config();


// Helper function to generate HMAC SHA256 signature
const generateSignature = (data:string) => {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(data);
  return hmac.digest('base64');
};

// Helper function to check transaction status
async function checkTransactionStatus(product_code:string, total_amount:Number, transaction_uuid:string) {
  try {
    const response = await axios.get(ESEWA_STATUS_URL, {
      params: {
        product_code,
        total_amount,
        transaction_uuid,
      }
    });
    return response.data;
  } catch (error) {
    console.error('eSewa status check error:', error);
    throw new Error('Failed to check transaction status');
  }
}

const ESEWA_API_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_STATUS_URL = 'https://uat.esewa.com.np/api/epay/transaction/status/';
const SECRET_KEY = '8gBm/:&EnhH.1/q'; // Use the provided secret key
const CALLBACK_URL = 'http://localhost:4000/api/v1/order/esewa/callback';
export async function handleEsewaCreate (req:AuthorizedRequest, res:Response,order:any,product:any){

    // Fetch the user from the database
    const user = await User.findById(req.user.id)
    if (!user) {
        throw new Error('User not found');
    }

    const amount = order.totalPrice;
    const taxAmount = Math.ceil(amount * 0.13); 
    const totalAmount = amount + taxAmount;
    const transactionUuid = `ESEWA-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const data = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`;
    const signature = generateSignature(data);
    await new Payment({
      MerchantCode: 'EPAYTEST',
      TranAmount: totalAmount,
      TransactionUuid: transactionUuid,
      ProductCode: 'EPAYTEST',
      UserId: user._id,
      ItemId: product._id,
      Status: PAYMENT_STATUS.PENDING,
      OrderId:order._id
    }).save();

    res.json({
      formData: {
        url: ESEWA_API_URL,
        amount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: 'EPAYTEST',
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: CALLBACK_URL,
        failure_url: CALLBACK_URL,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature,
      }
    });

}

export async function createOrder(req:AuthorizedRequest, res:Response){
    const productId = req.body.productId;
    const deliveryType = req.body.deliveryType;
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new Error('User not found');
    }
    const itemDetails = await Product.findById(productId).populate('seller');
    if (!itemDetails) {
        throw new Error('Product not found');
    }
    if(itemDetails.quantity<=0){
        throw new invalidInputError('Product is out of stock');
    }
    const order = new Order()
    order.product = productId;
    order.buyer = user._id;
    order.seller = itemDetails.seller;
    order.quantity = 1;
    order.totalPrice = itemDetails.price;
    order.orderStatus=ORDER_STATUS.PENDING;
    order.deliveryType=deliveryType;
    await order.save();
    handleEsewaCreate(req,res,order,itemDetails);
}

export async function updateOrder(req:AuthorizedRequest, res:Response){
    const orderStatus = req.body.status;
    const orderId = req.params.orderId;
    const order = await Order.findOne({ _id: orderId ,seller:req.user.id});
    if (!order) {
        throw new Error('Order not found');
    }
    if(Object.values(ORDER_STATUS).indexOf(orderStatus) === -1){
        throw new invalidInputError('Invalid order status');
    }
    order.orderStatus = orderStatus;
    await order.save();
    res.status(200).json({message:'Order updated successfully'});
}

// Route to handle eSewa callback
export async function handleEsewaCallback(req:Request, res:Response){
  try {
    const encodedData:any = req.query.data;
    const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
    const parsedData = JSON.parse(decodedData);

    let { transaction_uuid, status, product_code, total_amount } = parsedData;

    // Check transaction status if needed
    if (!status) {
      const statusResponse = await checkTransactionStatus(product_code, total_amount, transaction_uuid);
      status = statusResponse.status;
    }

    // Update transaction status in your database
    await Payment.updateOne({ TransactionUuid: transaction_uuid }, { Status: status });

    if (status === 'COMPLETE') {
      await updateModelsAfterSuccessfulPayment(transaction_uuid);
      res.redirect('http://localhost:3000/success');
    } else {
      res.redirect('/http://localhost:3000/failure');
    }
  } catch (error) {
    res.redirect('http://localhost:3000/failure');
  }
}

export async function getOrders(req:AuthorizedRequest, res:Response){
   const orders = await Order.find({ buyer: req.user.id }).populate('product').populate('seller');
    res.json(orders);
}

export async function getOrdersFromProduct(req:AuthorizedRequest, res:Response){
    const productId = req.params.productId;
    if (!productId) {
        throw new  invalidInputError('Product ID is required');
    }
    const orders = await Order.find({ product: productId }).populate('buyer');
    res.json(orders);
}

// Helper function to update models after successful payment
async function updateModelsAfterSuccessfulPayment(transactionUuid:string) {
  try {
    const transaction = await Payment.findOne({ TransactionUuid: transactionUuid });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const item = await Product.findById(transaction.ItemId);
    if (!item) {
      console.error(`Item not found for ItemId: ${transaction.ItemId}`);
      throw new Error('Item not found');
    }
    const order = await Order.findOne({ _id: transaction.OrderId });
    order.orderStatus = ORDER_STATUS.PLACED;
    transaction.Status=PAYMENT_STATUS.SUCCESS;
    await transaction.save();
    await order.save();
    item.quantity = item.quantity - 1;
    await item.save();
    
  } catch (error) {
    throw error;
  }
}

