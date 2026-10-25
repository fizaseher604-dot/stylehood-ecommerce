
import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const DELIVERY_FEE = 200;

// Place order using Cash on Delivery
const placeOrder = async (req, res) => {
    try {
        // userId must be set by authentication middleware
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
            Object.keys(address).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid delivery address is required",
            });
        }

        // Validate item IDs, sizes and quantities
        for (const item of items) {
            const quantity = Number(item?.quantity);

            if (
                !item?._id ||
                !mongoose.isValidObjectId(item._id) ||
                typeof item.size !== "string" ||
                !item.size.trim() ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 10
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product, size or quantity",
                });
            }
        }

        // Fetch actual product data from the database
        const productIds = [
            ...new Set(items.map((item) => String(item._id))),
        ];

        const products = await productModel.find({
            _id: { $in: productIds },
        });

        const productMap = new Map(
            products.map((product) => [
                String(product._id),
                product,
            ])
        );

        const verifiedItems = [];
        let subtotal = 0;

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

            // Only trusted database fields are saved
            verifiedItems.push({
                _id: String(product._id),
                name: product.name,
                price,
                Image: product.Image,
                category: product.category,
                size: item.size,
                quantity,
            });

            subtotal += price * quantity;
        }

        // Never trust the amount supplied by the frontend
        const verifiedAmount = subtotal + DELIVERY_FEE;

        const newOrder = new orderModel({
            userId,
            items: verifiedItems,
            address,
            amount: verifiedAmount,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: Date.now(),
        });

        await newOrder.save();

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

        return res.status(500).json({
            success: false,
            message: "Unable to place order",
        });
    }
};


// Stripe is not configured
const placeOrderStripe = async (req, res) => {
    if (!req.body.userId) {
        return res.status(401).json({
            success: false,
            message: "User authentication required",
        });
    }

    return res.status(501).json({
        success: false,
        message: "Stripe checkout is not configured",
    });
};


// Razorpay is not configured
const placeOrderRazorpay = async (req, res) => {
    if (!req.body.userId) {
        return res.status(401).json({
            success: false,
            message: "User authentication required",
        });
    }

    return res.status(501).json({
        success: false,
        message: "Razorpay checkout is not configured",
    });
};


// All orders for admin
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


// Orders for logged-in user
const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
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

        if (!orderId || !mongoose.isValidObjectId(orderId) || !status) {
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

        // COD is marked paid when the order is delivered
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
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
};
