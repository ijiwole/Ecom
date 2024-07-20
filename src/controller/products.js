import { StatusCodes } from 'http-status-codes';
import Product from '../models/product.js';
import Coupon from '../models/coupon.js';
import Category from '../models/category.js';

export const createProduct = async (req, res) => {
    const { name, price, description, categoryId, couponId } = req.body;

    if (!name || price === undefined || price === null || !categoryId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Name, price, and categoryId are required fields",
            status: StatusCodes.BAD_REQUEST
        });
    }

    if (isNaN(price) || price < 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Price must be a valid non-negative number",
            status: StatusCodes.BAD_REQUEST
        });
    }

    try {
        const category = await Category.findOne({ where: { id: categoryId } });
        if (!category) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Category not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        let discountAmount = 0;
        if (couponId) {
            const coupon = await Coupon.findByPk(couponId);
            if (!coupon) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Coupon not found",
                    status: StatusCodes.NOT_FOUND
                });
            }
            discountAmount = coupon.discountAmount || 0;
        }

        let discountedPrice = price - discountAmount;
        if (discountedPrice < 0) {
            discountedPrice = 0;
        }

        const newProduct = await Product.create({
            name,
            price,
            description,
            CategoryId: categoryId,
            CouponId: couponId || null,
            discountedPrice
        });

        return res.status(StatusCodes.CREATED).json({
            message: "Product created successfully",
            data: {
                id: newProduct.id,
                name: newProduct.name,
                price: newProduct.price,
                discountedPrice: discountedPrice,
                description: newProduct.description,
                createdAt: newProduct.createdAt,
                updatedAt: newProduct.updatedAt
            },
            status: StatusCodes.CREATED
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while creating the product",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};
