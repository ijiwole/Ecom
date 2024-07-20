import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import AuthRoles from "../utils/authRoles.js"; 
import cloudinary from "../utils/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import checkValidEmail from "../utils/emailValidator.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from 'bcryptjs';
import multer from "multer";


const cloud_storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: "Product",
        allowedFormats:["jpg", "png"]
    }
});

export const upload = multer({ storage: cloud_storage})



export const register = async ( req, res ) => {
    const { fullName, email, password, role} = req.body;
    if(!fullName || !email || !password || !role ){
        return res.status(StatusCodes.BAD_REQUEST).json({
            messgae:" Please fill all required fields",
            status: StatusCodes.BAD_REQUEST
        });
    }

    if(!Object.values(AuthRoles).includes(role)){
        return res.status(StatusCodes.BAD_REQUEST).json({
            messgae: "Invalid User Role",
            status: StatusCodes.BAD_REQUEST,
        });
    } 

   if(password.length < 8){
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Password lenght should not be less than eight characters",
        status: StatusCodes.BAD_REQUEST
    });
   }


   try {
        const existingUser = await User.findOne({ where: {email: email} });
        if(existingUser){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "User already exists",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            role: role
        });

        const token = generateToken(newUser.id);

        return res.status(StatusCodes.CREATED).json({
            message: " User registered successfully",
            user:{
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            },
            token: token
        });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
   };
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "All fields are required",
                status: StatusCodes.BAD_REQUEST
            });
        }
         checkValidEmail(res, email);

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User does not exist",
                status: StatusCodes.NOT_FOUND
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid password",
                status: StatusCodes.UNAUTHORIZED
            });
        }

        const token = generateToken(user.id);

        return res.status(StatusCodes.OK).json({
            message: "Login successful",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            token: token,
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const myProfile = async (req, res) => {
    const userId = req.headers.id; 
    try {
        const owner = await User.findByPk(userId);

        if (!owner) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        console.log(owner);
        return res.status(StatusCodes.OK).json({
            data: owner,
            message: "Profile fetched",
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const uploadPicture = async (req, res) => {
    const userId = req.headers.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User does not exist",
                status: StatusCodes.NOT_FOUND
            });
        }

        if (!req.file.path) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "No file provided!",
                status: StatusCodes.BAD_REQUEST
            });
        }

        user.imgUrl = req.file.path;
        user.imgPublicId = req.file.path.split("/").slice(7).join("/").split(".")[0];

        await user.save();

        return res.status(StatusCodes.OK).json({
            message: "Image Upload Successfully",
            data: { imgUrl: user.imgUrl, imgPublicId: user.imgPublicId },
            status: StatusCodes.OK
        });
    } catch (error) {
        console.error("Error uploading picture:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while uploading the picture",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const  editProfile = async ( req, res )=> {
    
    const userId = req.headers.id;

    const user = await User.findByPk(userId);
    
    if(!user){
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "User does not exist",
            status: StatusCodes.NOT_FOUND
        });
    }

    user.fullName = req.body.fullName ?? user.fullName;

    if(req.file){
        user.imgUrl = req.file.path;
        user.imgPublicId= req.file.fileName;
    }

    await user.save()

    return res.status(StatusCodes.ACCEPTED).json({
        msg: "Profile updated successfully",
        status: StatusCodes.ACCEPTED,
    });
};

export const deleteProfile = async (req, res) => {
    const userId = req.headers.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User does not exist",
                status: StatusCodes.NOT_FOUND
            });
        }

        await User.destroy({ where: { id: userId } });

        return res.status(StatusCodes.OK).json({
            message: "Profile Successfully deleted",
            status: StatusCodes.OK,
        });
    } catch (error) {
        console.error("Error deleting profile:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while deleting the profile",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};