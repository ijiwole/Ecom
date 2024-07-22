import express from 'express';
import { protect_user } from '../middlewares/auth.js';
import { createProduct, deleteAllProducts, deleteSingleProdcut, fetchAllProducts, fetchSingleProduct, updateSingleProduct } from '../controller/products.js';

const productRouter = express.Router()

productRouter.route("/create").post(protect_user, createProduct)
productRouter.route("/:id/update").patch(protect_user, updateSingleProduct)
productRouter.route("/all").get(protect_user, fetchAllProducts)
productRouter.route("/:id").get(protect_user, fetchSingleProduct)
productRouter.route("/:id/delete").delete(protect_user, deleteSingleProdcut)
productRouter.route("/delete").delete(protect_user, deleteAllProducts)


export default productRouter;