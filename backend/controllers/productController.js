
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      price === undefined ||
      price === "" ||
      !category ||
      !subCategory ||
      !sizes
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid product price",
      });
    }

    if (
      stock === undefined ||
      stock === "" ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a whole number of 0 or more",
      });
    }

    let parsedSizes;

    try {
      parsedSizes = JSON.parse(sizes);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid product sizes",
      });
    }

    if (
      !Array.isArray(parsedSizes) ||
      parsedSizes.length === 0 ||
      !parsedSizes.every((size) => typeof size === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Select at least one valid size",
      });
    }

    const images = (req.files || []).filter((file) =>
      ["image1", "image2", "image3", "image4"].includes(file.fieldname)
    );

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one product image",
      });
    }

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          upload_preset: "ml_default",
        });

        return result.secure_url;
      })
    );

    const product = new productModel({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      stock: numericStock,
      category,
      subCategory,
      bestseller: bestseller === "true",
      Sizes: parsedSizes,
      Image: imagesUrl,
      date: Date.now(),
    });

    await product.save();

    return res.json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add product",
    });
  }
};

// List Products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).lean();

    return res.json({
      success: true,
      products: products.map((product) => ({
        ...product,
        stock: Number.isInteger(Number(product.stock))
          ? Number(product.stock)
          : 0,
      })),
    });
  } catch (error) {
    console.error("List products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load products",
    });
  }
};

// Update Stock
const updateStock = async (req, res) => {
  try {
    const { id, stock } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    if (
      stock === undefined ||
      stock === "" ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a whole number of 0 or more",
      });
    }

    const product = await productModel.findByIdAndUpdate(
      id,
      { $set: { stock: Number(stock) } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update stock error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update stock",
    });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product Removed",
      product,
    });
  } catch (error) {
    console.error("Remove product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};

// Single Product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    const product = await productModel.findById(productId).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product: {
        ...product,
        stock: Number.isInteger(Number(product.stock))
          ? Number(product.stock)
          : 0,
      },
    });
  } catch (error) {
    console.error("Single product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load product",
    });
  }
};

export {
  addProduct,
  listProducts,
  updateStock,
  removeProduct,
  singleProduct,
};
