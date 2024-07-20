import { StatusCodes } from "http-status-codes";
import Coupon from "../models/coupon.js";
import generateCouponCode from "../utils/generateCoupon.js";

export const createCoupon = async (req, res) => {
    const { discount } = req.body;
    const code = generateCouponCode();

    if (!discount) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Discount is required",
            status: StatusCodes.BAD_REQUEST
        });
    }

    try {
        const existingCoupon = await Coupon.findOne({ where: { code } });

        if (existingCoupon) {
            return res.status(StatusCodes.CONFLICT).json({
                message: "Coupon code already exists",
                status: StatusCodes.CONFLICT
            });
        }

        const coupon = await Coupon.create({ code, discount });

        return res.status(StatusCodes.CREATED).json({
            message: "Coupon created successfully",
            data: coupon,
            status: StatusCodes.CREATED
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An error occurred while creating the coupon',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const toggleCoupon = async (req, res) => {
    const { id } = req.params;

    try {
        const coupon = await Coupon.findByPk(id);

        if (!coupon) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Coupon not found",
                status: StatusCodes.NOT_FOUND
            });
        }
        console.log(coupon.isActive)
        coupon.isActive ?  coupon.isActive = false :  coupon.isActive = true;
        await coupon.save();

        return res.status(StatusCodes.OK).json({
            message: !coupon.isActive ? "Coupon deactivated successfully" : "Coupon activated successfully",
            data: coupon,
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An error occurred while deactivating the coupon',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const fetchActiveCoupons = async( req, res ) => {
    
    const activeCoupons = await Coupon.findAll({where: {isActive: true}})
    if(!activeCoupons || activeCoupons == 0){
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "NO coupon found",
            status: StatusCodes.NOT_FOUND
        });
    }

    return res.status(StatusCodes.OK).json({
        message: "Here are the available coupons",
        data: activeCoupons
    })

};

export const deleteAllCoupons = async (req, res) => {
    try {
        await Coupon.destroy({
            where: {},
            truncate: false
        });

        return res.status(StatusCodes.OK).json({
            message: "All coupons deleted successfully",
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An error occurred while deleting the coupons',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};
