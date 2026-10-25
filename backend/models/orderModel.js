import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  items: {
    type: Array,
    required: true,
    validate: {
      validator: (items) => Array.isArray(items) && items.length > 0,
      message: "Order must contain at least one product",
    },
  },

  amount: {
    type: Number,
    required: true,
    min: 0,
  },

  address: {
    type: Object,
    required: true,
  },

  status: {
    type: String,
    required: true,
    default: "Order Placed",
    enum: [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
  },

  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Stripe", "Razorpay"],
  },

  payment: {
    type: Boolean,
    required: true,
    default: false,
  },

  date: {
    type: Number,
    required: true,
    default: Date.now,
  },
});

const orderModel =
  mongoose.models.order ||
  mongoose.model("order", orderSchema);

export default orderModel;