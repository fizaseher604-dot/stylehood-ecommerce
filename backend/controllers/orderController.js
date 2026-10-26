import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const DELIVERY_FEE = 200;

// Place COD order and reserve stock
const placeOrder = async (req, res) => {
  const reservedItems = [];
  let orderSaved = false;

  // Restore stock if the order cannot be saved
  const restoreStock = async () => {
    for (const reserved of [...reservedItems].reverse()) {
      await productModel.updateOne(
        { _id: reserved.id },
        { $inc: { stock: reserved.quantity } }
      );
    }

    reservedItems.length = 0;
  };

  try {
    const userId = req.body.userId;
    const { items, address } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }

    if (
      !address ||
      typeof address !== "object" ||
      Array.isArray(address) ||
      !address.firstName ||
      !address.lastName ||
      !address.email ||
      !address.street ||
      !address.city ||
      !address.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete delivery information",
      });
    }

    // Validate product IDs, sizes and quantities
    for (const item of items) {
      const quantity = Number(item?.quantity);

      if (
        !item?._id ||
        !mongoose.isValidObjectId(item._id) ||
        typeof item.size !== "string" ||
        !item.size.trim() ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 40
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product, size or quantity",
        });
      }
    }

    const productIds = [
      ...new Set(items.map((item) => String(item._id))),
    ];

    const products = await productModel
      .find({
        _id: { $in: productIds },
      })
      .lean();

    const productMap = new Map(
      products.map((product) => [
        String(product._id),
        product,
      ])
    );

    const verifiedItems = [];
    const requestedByProduct = new Map();
    let subtotal = 0;

    // Validate products, sizes and database prices
    for (const item of items) {
      const product = productMap.get(String(item._id));
      const quantity = Number(item.quantity);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart no longer exists",
        });
      }

      const availableSizes = Array.isArray(product.Sizes)
        ? product.Sizes.map(String)
        : [];

      if (!availableSizes.includes(item.size)) {
        return res.status(400).json({
          success: false,
          message: `Selected size is unavailable for ${product.name}`,
        });
      }

      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product price",
        });
      }

      const productId = String(product._id);

      requestedByProduct.set(
        productId,
        (requestedByProduct.get(productId) || 0) + quantity
      );

      verifiedItems.push({
        _id: productId,
        name: product.name,
        price,
        Image: product.Image,
        category: product.category,
        size: item.size,
        quantity,
      });

      subtotal += price * quantity;
    }

    // Check combined quantity for each product
    for (const [productId, requestedQuantity] of requestedByProduct) {
      const product = productMap.get(productId);
      const available = Number(product?.stock) || 0;

      if (available < requestedQuantity) {
        return res.status(409).json({
          success: false,
          message: `${
            product?.name || "Product"
          } has only ${available} item(s) available, but ${requestedQuantity} requested. Please update your cart.`,
        });
      }
    }

    // Atomically reserve stock
    for (const [productId, quantity] of requestedByProduct) {
      const updatedProduct = await productModel.findOneAndUpdate(
        {
          _id: productId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        {
          new: true,
        }
      );

      if (!updatedProduct) {
        const latestProduct = await productModel
          .findById(productId)
          .select("name stock")
          .lean();

        await restoreStock();

        return res.status(409).json({
          success: false,
          message: latestProduct
            ? `${latestProduct.name} has only ${
                Number(latestProduct.stock) || 0
              } item(s) left. Please update your cart and try again.`
            : "A product in your cart no longer exists",
        });
      }

      reservedItems.push({
        id: String(updatedProduct._id),
        quantity,
      });
    }

    // Create COD order
    const newOrder = new orderModel({
      userId,
      items: verifiedItems,
      address,
      amount: subtotal + DELIVERY_FEE,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();
    orderSaved = true;

    // Clear cart after successful order
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
    });

    return res.json({
      success: true,
      message: "Order Placed",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error);

    // Restore stock if order was not saved
    if (!orderSaved && reservedItems.length > 0) {
      try {
        await restoreStock();
      } catch (restoreError) {
        console.error("Stock restoration error:", restoreError);
      }
    }

    return res.status(500).json({
      success: false,
      message: orderSaved
        ? "Your order was saved, but another operation failed. Check My Orders before trying again."
        : "Unable to place order. Please try again.",
    });
  }
};

// Get all orders for admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ date: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};

// Get orders for logged-in user
const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const orders = await orderModel
      .find({ userId })
      .sort({ date: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("User Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your orders",
    });
  }
};

// Update order status from admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (
      !orderId ||
      !mongoose.isValidObjectId(orderId) ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid order ID and status are required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const existingOrder = await orderModel.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    existingOrder.status = status;

    // Mark COD payment complete after delivery
    if (
      existingOrder.paymentMethod === "COD" &&
      status === "Delivered"
    ) {
      existingOrder.payment = true;
    }

    await existingOrder.save();

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order: existingOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status",
    });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
};