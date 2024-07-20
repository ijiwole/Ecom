import express from "express";
import { protect_user } from "../middlewares/auth.js";
import { createCoupon, fetchActiveCoupons, deleteAllCoupons, toggleCoupon} from "../controller/coupon.js";

const couponRouter = express.Router();

couponRouter.route('/create').post(protect_user, createCoupon);
couponRouter.route('/:id/toggle').put(protect_user, toggleCoupon);
couponRouter.route('/active').get(protect_user, fetchActiveCoupons);
couponRouter.route('/deleteAll').delete(protect_user, deleteAllCoupons);

export default couponRouter;
