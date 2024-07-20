import Category from "../models/category.js";
import { StatusCodes } from "http-status-codes";

export const createCategory = async (req, res ) => {
    const {name, description} = req.body;
    if(!name){
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Category name is required",
            status: StatusCodes.BAD_REQUEST
        });
    }

    const newCategory = await Category.create({
        name,
        description
    })
    newCategory.save()

    return res.status(StatusCodes.CREATED).json({
        message: "Category created successfully",
        data: newCategory,
        status: StatusCodes.CREATED
    });
};

export const deleteCategoryById = async ( req, res ) => {
    const { id } = req.params;

    const category = await Category.findByPk(id);
        if(!category){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Category not found",
                status: StatusCodes.NOT_FOUND
            });
        }
        await Category.destroy({where: {id: id}})
        
        return res.status(StatusCodes.OK).json({
            message: "Category successfully deleted",
             deleted: true,
            status: StatusCodes.OK
        })
};   

export const fetchAllCategories = async ( req, res ) => {
    
    const categories = await Category.findAll()

     if(!categories || categories.length == 0){
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "No existing category",
            status: StatusCodes.NOT_FOUND
        });
     }
     return res.status(StatusCodes.OK).json({
        message: "Categories retrieved successfully",
        data: categories,
        status: StatusCodes.OK
     })
};

export const updateCategory = async ( req, res ) => {
    const {id} = req.params;
    const { description } = req.body;
        if(!description){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Description required",
                status: StatusCodes.NOT_FOUND
            });
        }
   const category = await Category.findByPk(id)
    
    if(!category){
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "Category with the Id not found",
            status: StatusCodes.NOT_FOUND
        });
    }
    category.description = description;
    await category.save()

    return res.status(StatusCodes.OK).json({
        message: "Category successfully updated",
        status: StatusCodes.OK
    })
};

export const getCategoryById = async(req, res) => {
    const {id} = req.params;

    const category = await Category.findByPk(id);

    if(!category){
        return res.status(StatusCodes.NOT_FOUND).json({
            message: " Category does not exist",
            status: StatusCodes.NOT_FOUND
        })
    }
        return res.status(StatusCodes.OK).json({
            message: "Category retrieved Successfully",
            data: category,
            status: StatusCodes.OK
        })
};

export const deleteAllCategories = async (req, res) => {
    try {
        await Category.destroy({
            where: {},
            truncate: false
        });

        return res.status(StatusCodes.OK).json({
            message: "All categories deleted successfully",
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An error occurred while deleting the categories',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};
