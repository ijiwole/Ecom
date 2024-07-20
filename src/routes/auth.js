import express from 'express'
import { deleteProfile, editProfile, login, myProfile, register, uploadPicture } from '../controller/auth.js'
import { protect_user } from '../middlewares/auth.js'

const authRouter = express.Router()

authRouter.route("/register").post(register)
authRouter.route("/login").post(login)
authRouter.route("/profile/").get(protect_user, myProfile)
authRouter.route("/upload").post(protect_user, uploadPicture)
authRouter.route("/edit").post(protect_user, editProfile)
authRouter.route("/delete").post(protect_user, deleteProfile)

export default authRouter;


