import express from 'express'

import {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct
} from '../controllers/productController.js'

import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router()

productRouter.post(
    "/add",
    adminAuth,
    upload.any(),
    addProduct
);

productRouter.get('/list', listProducts)

productRouter.post('/remove',adminAuth, removeProduct)

productRouter.post('/single', singleProduct)

export default productRouter