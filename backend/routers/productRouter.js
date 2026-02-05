import express from "express";
import { Add_Product, Delete_Product, Generate_AltNames, Generate_Description, Get_Low_Stock_Products, Get_Newly_Added_Products, Get_Product_Count, Get_Top_Viewed_Products, Increase_Product_Views, Update_Product_Details, View_Product_ById, View_Products } from "../controllers/productController.js";



const productRouter = express.Router();

productRouter.post("/add_product",Add_Product );
productRouter.get("/view_products", View_Products);
productRouter.put("/update_product/:id", Update_Product_Details);
productRouter.delete("/delete_product/:id", Delete_Product);
productRouter.get("/view_product/:id", View_Product_ById);
productRouter.post("/increase_views/:id", Increase_Product_Views);
productRouter.get("/top_viewed", Get_Top_Viewed_Products);
productRouter.get("/count", Get_Product_Count);
productRouter.get("/low-stock", Get_Low_Stock_Products);
productRouter.get("/new-products", Get_Newly_Added_Products);
productRouter.post("/ai-generate_altnames", Generate_AltNames);
productRouter.post("/ai-generate_description", Generate_Description);




export default productRouter;