import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add Product
const addProduct = async (req, res) => {
  const startTime = Date.now();

  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !subCategory ||
      !sizes
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Get selected images
    const images = (req.files || []).filter((file) =>
      ["image1", "image2", "image3", "image4"].includes(file.fieldname)
    );

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one product image",
      });
    }

    // Upload images to Cloudinary in parallel
    const uploadStart = Date.now();

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          upload_preset: "ml_default",
        });

        return result.secure_url;
      })
    );

    const uploadTime = Date.now() - uploadStart;

    console.log(`Cloudinary upload time: ${uploadTime} ms`);

    // Prepare product data
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true",
      Sizes: JSON.parse(sizes),
      Image: imagesUrl,
      date: Date.now(),
    };

    // Save product to MongoDB
    const dbStart = Date.now();

    const product = new productModel(productData);
    await product.save();

    const dbTime = Date.now() - dbStart;
    const totalTime = Date.now() - startTime;

    console.log(`MongoDB save time: ${dbTime} ms`);
    console.log(`Total product add time: ${totalTime} ms`);

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
      products,
    });
  } catch (error) {
    console.error("List products error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
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
      message: error.message,
    });
  }
};

// Single Product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
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
      product,
    });
  } catch (error) {
    console.error("Single product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
};