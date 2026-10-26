import express from 'express'
import {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct,
    updateStock,
} from '../controllers/productController.js'

import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'

const productRouter = express.Router()

productRouter.post('/add', adminAuth, upload.any(), addProduct)

productRouter.get('/list', listProducts)

productRouter.post('/remove', adminAuth, removeProduct)

productRouter.post('/single', singleProduct)

// Stock update route
productRouter.post('/stock', adminAuth, updateStock)

export default productRouter