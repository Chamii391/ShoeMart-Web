import express from "express";
import { Accept_Order, Complete_Order, Make_Order, View_Admin_Orders, View_My_Orders, View_Orders_ByUser } from "../controllers/orderController.js";


const orderRouter = express.Router();


orderRouter.post("/make_order", Make_Order);
orderRouter.get("/my_orders", View_My_Orders);
orderRouter.get("/admin_orders", View_Admin_Orders);
orderRouter.get("/view_orders/:user_id", View_Orders_ByUser);
orderRouter.put("/accept_order/:order_id", Accept_Order);
orderRouter.put("/complete_order/:order_id", Complete_Order);


export default orderRouter;