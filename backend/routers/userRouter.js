import express from "express";
import { Createuser, login, updateUser, viewUserDetails } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/register",Createuser);
userRouter.post("/login",login);
userRouter.get("/user/:userid", viewUserDetails);
userRouter.put("/edit-profile/:userid", updateUser);



export default userRouter