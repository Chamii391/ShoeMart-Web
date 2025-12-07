import express from "express";
import { Createuser, login, Total_Customer_Count, updateUser, viewUserDetails } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/register",Createuser);
userRouter.post("/login",login);
userRouter.get("/user/:userid", viewUserDetails);
userRouter.put("/edit-profile/:userid", updateUser);
userRouter.get("/count-customers", Total_Customer_Count);




export default userRouter