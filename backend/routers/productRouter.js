import express from "express";
import { Add_Product, Delete_Product, Update_Product_Details, View_Product_ById, View_Products } from "../controllers/productController.js";



const productRouter = express.Router();

productRouter.post("/add_product",Add_Product );
productRouter.get("/view_products", View_Products);
productRouter.put("/update_product/:id", Update_Product_Details);
productRouter.delete("/delete_product/:id", Delete_Product);
productRouter.get("/view_product/:id", View_Product_ById);


export default productRouter;