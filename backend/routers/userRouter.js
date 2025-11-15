import express from "express";
import { Createuser, login } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/register",Createuser);
userRouter.post("/login",login);

export default userRouter