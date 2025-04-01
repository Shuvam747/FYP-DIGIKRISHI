import { Request, Response } from "express";
import { Product } from "../../model/product.model";
import { invalidInputError } from "../../middleware/errorHandler.middleware";
import { AuthorizedRequest } from "../../typings/base.type";
import { User } from "../../model/user.model";
import { Review } from "../../model/review.model";

export class ProductController {

  async getProducts(req: Request, res: Response): Promise<void> {
    const products = await Product.find().lean().populate("seller").populate("reviews").populate("reviews.user");
    res.status(200).json(products);
  }



  async createProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    const { name, description, price, quantity, availableForDelivery } = req.body;
    if(!name || !price || !quantity || !availableForDelivery) 
        throw new invalidInputError("Name, price, quantity and availableForDelivery are required");
    const user = await User.findById(req.user.id);
    if(!user) 
        throw new invalidInputError("User not found");
    // if(!user.isVerified)
    //     throw new invalidInputError("User is not verified");
    const product = new Product()
    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.availableForDelivery = availableForDelivery;
    product.seller = user.id
    if(req.file)
    {
      product.image=req.file.filename;
    }
    await product.save();
    res.status(200).json({ message: "Product created successfully"});
  }

  async updateProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    if(!req.params.id) 
        throw new invalidInputError("Product ID is required");
    const product = await Product.findOne({ _id: req.params.id ,seller: req.user.id});
    if(!product) 
        throw new invalidInputError("Product not found");
    const { name, description, price, quantity, availableForDelivery } = req.body;
    if(name) product.name = name;
    if(description) product.description = description;
    if(price) product.price = price;
    if(quantity) product.quantity = quantity;
    if(availableForDelivery) product.availableForDelivery = availableForDelivery;
    await product.save();
    res.status(200).json({ message: "Product updated successfully"});
  }

  async changeProductImage(req: AuthorizedRequest, res: Response): Promise<void> {
    if(!req.params.id) 
        throw new invalidInputError("Product ID is required");
    const product = await Product.findOne({ _id: req.params.id ,seller: req.user.id});
    if(!product) 
        throw new invalidInputError("Product not found");
    if(req.file)
    {
        product.image=req.file.filename;
    }
    await product.save();
    res.status(200).json({ message: "Product image updated successfully"});
  }

  async deleteProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    if(!req.params.id) 
        throw new invalidInputError("Product ID is required");
    const product = await Product.findOneAndDelete({ _id: req.params.id ,seller: req.user.id});
    if(!product) 
        throw new invalidInputError("Product not found");
    res.status(200).json({ message: "Product deleted successfully"});

  }

  async getMyProducts(req: AuthorizedRequest, res: Response): Promise<void> {
    const products = await Product.find({seller: req.user.id}).lean();
    res.status(200).json(products);
  }

  async verifyProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    if(!req.params.id) 
        throw new invalidInputError("Product ID is required");
    const product = await Product.findOne({ _id: req.params.id});
    if(!product) 
        throw new invalidInputError("Product not found");
    product.isVerified = true;
    await product.save();
    res.status(200).json({ message: "Product verified successfully"});
  }

  async unverifyProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    if(!req.params.id) 
        throw new invalidInputError("Product ID is required");
    const product = await Product.findOne({ _id: req.params.id});
    if(!product) 
        throw new invalidInputError("Product not found");
    product.isVerified = false;
    await product.save();
    res.status(200).json({ message: "Product unverified successfully"});
  }

  async postReview(req: AuthorizedRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    const { rating, comment } = req.body;

   if(!productId || !rating)
        throw new invalidInputError("Product ID and rating are required");
    const product = await Product.findById(productId);
    if(!product)
        throw new invalidInputError("Product not found");

        const user = await User.findById(req.user.id);
        const review = new Review();
        review.user = user._id;
        review.rating = rating;
        review.comment = comment;
        review.product = product._id;
        product.reviews.push(review._id);
        await review.save();
        await product.save();
    res.status(200).json({ message: "Review posted successfully"});

}

}
