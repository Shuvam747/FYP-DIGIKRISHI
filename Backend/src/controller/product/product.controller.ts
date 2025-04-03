import { Request, Response } from "express";
import { Product } from "../../model/product.model";
import { invalidInputError, resourceNotFound } from "../../middleware/errorHandler.middleware";
import { AuthorizedRequest } from "../../typings/base.type";
import { User } from "../../model/user.model";
import { Review } from "../../model/review.model";

export class ProductController {
  async getProducts(req: Request, res: Response): Promise<void> {
    const products = await Product.find()
      .lean()
      .populate("seller", "username email profilePicture")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "username profilePicture"
        }
      });
    
    res.status(200).json(products);
  }

  async createProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    const { name, description, price, quantity, availableForDelivery } = req.body;
    
    if (!name || !price || !quantity || availableForDelivery === undefined) {
      throw new invalidInputError("Name, price, quantity and availableForDelivery are required");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new resourceNotFound("User not found");
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      availableForDelivery: availableForDelivery === 'true',
      seller: user.id,
      image: req.file?.filename
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ 
      message: "Product created successfully",
      product: {
        id: product._id,
        name: product.name,
        price: product.price
      }
    });
  }

  async updateProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
      throw new invalidInputError("Product ID is required");
    }

    const product = await Product.findOne({ _id: productId, seller: req.user.id });
    if (!product) {
      throw new resourceNotFound("Product not found or you don't have permission");
    }

    const { name, description, price, quantity, availableForDelivery } = req.body;
    
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (quantity) product.quantity = parseInt(quantity);
    if (availableForDelivery !== undefined) {
      product.availableForDelivery = availableForDelivery === 'true';
    }

    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  }

  async changeProductImage(req: AuthorizedRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
      throw new invalidInputError("Product ID is required");
    }

    if (!req.file) {
      throw new invalidInputError("Image file is required");
    }

    const product = await Product.findOne({ _id: productId, seller: req.user.id });
    if (!product) {
      throw new resourceNotFound("Product not found or you don't have permission");
    }

    product.image = req.file.filename;
    await product.save();

    res.status(200).json({ 
      message: "Product image updated successfully",
      imageUrl: `/uploads/${product.image}`
    });
  }

  async deleteProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
      throw new invalidInputError("Product ID is required");
    }

    const product = await Product.findOneAndDelete({ _id: productId, seller: req.user.id });
    if (!product) {
      throw new resourceNotFound("Product not found or you don't have permission");
    }

    res.status(200).json({ message: "Product deleted successfully" });
  }

  async getMyProducts(req: AuthorizedRequest, res: Response): Promise<void> {
    const products = await Product.find({ seller: req.user.id })
      .lean()
      .select("name price quantity image isVerified");
    
    res.status(200).json(products);
  }

  async verifyProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
      throw new invalidInputError("Product ID is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new resourceNotFound("Product not found");
    }

    product.isVerified = true;
    await product.save();

    res.status(200).json({ message: "Product verified successfully" });
  }

  async unverifyProduct(req: AuthorizedRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
      throw new invalidInputError("Product ID is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new resourceNotFound("Product not found");
    }

    product.isVerified = false;
    await product.save();

    res.status(200).json({ message: "Product unverified successfully" });
  }

  async postReview(req: AuthorizedRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    if (!productId || !rating) {
      throw new invalidInputError("Product ID and rating are required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new resourceNotFound("Product not found");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new resourceNotFound("User not found");
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      user: user._id, 
      product: product._id 
    });

    if (existingReview) {
      throw new invalidInputError("You have already reviewed this product");
    }

    const review = new Review({
      user: user._id,
      rating: parseInt(rating),
      comment,
      product: product._id
    });

    await review.save();
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ 
      message: "Review posted successfully",
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment
      }
    });
  }
}