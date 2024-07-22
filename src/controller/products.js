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


export const updateSingleProduct = async(req, res) =>{
    const { id } = req.params;
    const {name, price, description, categoryId} = req.body;

    try {
        
        const product = await Product.findByPk(id);
         if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Product ID does not exist",
                status: StatusCodes.NOT_FOUND
            });
        }

        if(categoryId){
            const category = await Category.findOne({ where: {id:categoryId } });
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Category ID does not exist",
                    status: StatusCodes.NOT_FOUND
                });
            }
            product.categoryId = category.id;
        }
        if(name) product.name = name;
        if(price !== undefined) product.price = price;
        if(description) product.description = description

        await product.save()

        return res.status(StatusCodes.OK).json({
            message: "Product updated successfully",
            data: product,
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while updating the product",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const fetchAllProducts = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    try {
        const offset = (page - 1) * limit;
        
        const { count, rows } = await Product.findAndCountAll({
            offset: parseInt(offset, 20),
            limit: parseInt(limit, 20)
        });

        if (rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "No available Products",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Products retrieved successfully",
            data: rows,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page, 10),
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while retrieving the products",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const fetchSingleProduct = async( req, res ) => {
    const {id} = req.params;

    const product = await Product.findByPk(id)
        if(!product){
            return res.status(StatusCodes.NOT_FOUND).json({
                message : "Product does not exist",
                status: StatusCodes.NOT_FOUND
            });
        }
        return res.status(StatusCodes.OK).json({
            message: "Product retrieved successfully",
            data: product,
            status: StatusCodes.OK
        })
};

export const deleteSingleProdcut = async(req, res) =>{
    const {id} = req.params;

    const product = await Product.destroy({
        where: {id},
        truncate: false
    });

    if(!product){
        return res.status(StatusCodes.NOT_FOUND).json({
            message: " Produt does not exist",
            status: StatusCodes.NOT_FOUND
        });
    }

    return res.status(StatusCodes.OK).json({
        message: "Product deleted successfully",
        status: StatusCodes.OK
    })
};

export const deleteAllProducts = async(req, res) => {
   
   await Product.destroy({
        where: {},
        truncate: false
    });

    return res.status(StatusCodes.OK).json({
        message: "All products deleted",
        status: StatusCodes.OK
    })
}