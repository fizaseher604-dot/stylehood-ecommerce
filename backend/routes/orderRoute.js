import express from "express";

import {
    placeOrder,
    allOrders,
    userOrders,
    updateStatus,
    placeOrderManual, // NEW
    markOrderPaid     // NEW
} from "../controllers/orderController.js";

import authUser from "../middleware/authUser.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js"; // NEW (apni multer file ka sahi naam/path check kar lein)

const orderRouter = express.Router();

// User routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);
// NEW: upload pehle, authUser baad mein (multipart form mein req.body multer hi banata hai)
orderRouter.post("/manual", upload.single("proof"), authUser, placeOrderManual);

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/mark-paid", adminAuth, markOrderPaid); // NEW

export default orderRouter;