import express from "express";
import { Make_Order, View_My_Orders } from "../controllers/orderController.js";


const orderRouter = express.Router();


orderRouter.post("/make_order", Make_Order);
orderRouter.get("/my_orders", View_My_Orders);


export default orderRouter;