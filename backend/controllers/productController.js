import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for add product
const addProduct = async (req, res) => {
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

    const images = (req.files || []).filter((file) =>
      ["image1", "image2", "image3", "image4"].includes(file.fieldname),
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          upload_preset: "ml_default",
        });

        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true",
      Sizes: JSON.parse(sizes),
      Image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);

    await product.save();

    res.json({
      success: true,
      message: "Product Added Successfully"
     
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function for remove product

const removeProduct = async (req, res) => {
  try {
    console.log("1. Remove function started");
    console.log("2. Request body:", req.body);

    const product = await productModel.findByIdAndDelete(req.body.id);

    console.log("3. Database query completed");

    res.json({
      success: true,
      message: "Product Removed",
      product
    });
  } catch (error) {
    console.log("Remove error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Function for single product info
const singleProduct = async (req, res) => {
   try {
       const { productId}= req.body
       const product=await productModel.findById(productId)
       res.json({success:true,product})
   } catch (error) {
      console.log("Remove error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
   }
};

export { addProduct, listProducts, removeProduct, singleProduct };
