import express from "express";
import { Createuser } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/register",Createuser);

export default userRouter