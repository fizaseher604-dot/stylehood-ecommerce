import userModel from "../models/userModel.js";

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity = 1 } = req.body;

        if (!userId || !itemId || !size) {
            return res.status(400).json({
                success: false,
                message: "User ID, Product ID and Size are required",
            });
        }

        const amount = Number(quantity);

        if (!Number.isInteger(amount) || amount < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer",
            });
        }

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] =
            (Number(cartData[itemId][size]) || 0) + amount;

        userData.cartData = cartData;
        userData.markModified("cartData");

        await userData.save();

        return res.json({
            success: true,
            message: "Added To Cart",
            cartData: userData.cartData,
        });
    } catch (error) {
        console.log("Add To Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update product quantity
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        if (
            !userId ||
            !itemId ||
            !size ||
            quantity === undefined ||
            quantity === null
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing cart information",
            });
        }

        const amount = Number(quantity);

        if (!Number.isInteger(amount) || amount < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity",
            });
        }

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cartData = userData.cartData || {};

        if (!cartData[itemId] || cartData[itemId][size] === undefined) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        if (amount === 0) {
            delete cartData[itemId][size];

            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = amount;
        }

        userData.cartData = cartData;
        userData.markModified("cartData");

        await userData.save();

        return res.json({
            success: true,
            message: "Cart Updated",
            cartData: userData.cartData,
        });
    } catch (error) {
        console.log("Update Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get logged-in user's cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing",
            });
        }

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            cartData: userData.cartData || {},
        });
    } catch (error) {
        console.log("Get User Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { addToCart, updateCart, getUserCart };