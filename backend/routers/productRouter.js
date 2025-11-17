import express from "express";
import { Add_Product } from "../controllers/productController.js";



const productRouter = express.Router();

productRouter.post("/add_product",Add_Product );


export default productRouter;