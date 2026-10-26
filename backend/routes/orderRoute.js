import express from "express";

import {
    placeOrder,
    allOrders,
    userOrders,
    updateStatus
} from "../controllers/orderController.js";

import authUser from "../middleware/authUser.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// User routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

export default orderRouter;