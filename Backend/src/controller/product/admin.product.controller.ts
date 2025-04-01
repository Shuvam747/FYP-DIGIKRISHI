import { invalidInputError } from "../../middleware/errorHandler.middleware";
import { Product } from "../../model/product.model";
import { Request, Response } from "express";
export class AdminProductController {
  async getProducts(req: Request, res: Response): Promise<void> {
    const products = Product.find();
    res.status(200).json(products);
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    if (!req.params.id) throw new invalidInputError("Product ID is required");
    const product = Product.findById(req.params.id).populate("reviews");
    if (!product) throw new invalidInputError("Product not found");
    res.status(200).json(product);
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const { name, description, price, quantity, availableForDelivery } =
      req.body;
    if (!name || !price || !quantity || !availableForDelivery)
      throw new invalidInputError(
        "Name, price, quantity and availableForDelivery are required"
      );
    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.availableForDelivery = availableForDelivery;
    if (req.file) {
      product.image = req.file.filename;
    }
    await product.save();
    res.status(200).json({ message: "Product created successfully" });
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    if (!req.params.id) throw new invalidInputError("Product ID is required");
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) throw new invalidInputError("Product not found");
    const {
      name,
      description,
      price,
      quantity,
      availableForDelivery,
      isVerified,
    } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (availableForDelivery)
      product.availableForDelivery = availableForDelivery;
    if (isVerified) product.isVerified = isVerified;
    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  }

  async changeProductImage(req: Request, res: Response): Promise<void> {
    if (!req.params.id) throw new invalidInputError("Product ID is required");
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) throw new invalidInputError("Product not found");
    if (req.file) {
      product.image = req.file.filename;
    }
    await product.save();
    res.status(200).json({ message: "Product image changed successfully" });
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    if (!req.params.id) throw new invalidInputError("Product ID is required");
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    if (!product) throw new invalidInputError("Product not found");
    res.status(200).json({ message: "Product deleted successfully" });
  }
}
