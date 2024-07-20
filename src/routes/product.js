import express from 'express';
import { protect_user } from '../middlewares/auth.js';
import { createProduct } from '../controller/products.js';

const productRouter = express.Router()

productRouter.route("/create").post(protect_user, createProduct)

export default productRouter;