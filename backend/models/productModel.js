import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  Image: {
    type: Array,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  subCategory: {
    type: String,
    required: true,
  },

  Sizes: {
    type: Array,
    required: true,
  },

  bestseller: {
    type: Boolean,
    default: false,
  },

  stock: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "Stock must be a whole number.",
    },
  },

  date: {
    type: Number,
    required: true,
  },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
