import express from 'express'

import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    updateStatus,
    userOrders
} from '../controllers/orderController.js'

import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/authUser.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Cash on Delivery
orderRouter.post('/place', authUser, placeOrder)

// Stripe payment
orderRouter.post('/stripe', authUser, placeOrderStripe)

// Razorpay payment
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

// User orders
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter