import express from "express";
import { protect_user } from "../middlewares/auth.js";
import {
  createCategory,
  deleteAllCategories,
  deleteCategoryById,
  fetchAllCategories,
  getCategoryById,
  updateCategory,
} from "../controller/category.js";

const categoryRouter = express.Router();

categoryRouter.route("/find").get(protect_user, fetchAllCategories);
categoryRouter.route("/create").post(protect_user, createCategory);
categoryRouter.route("/:id/delete").delete(protect_user, deleteCategoryById);
categoryRouter.route("/:id/update").put(protect_user, updateCategory);
categoryRouter.route("/:id").get(protect_user, getCategoryById);
categoryRouter.route("/delete").delete(protect_user, deleteAllCategories);

export default categoryRouter;