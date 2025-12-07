import express from "express";
import { Accept_Order, Cancel_Order, Complete_Order, Get_User_Order_Stats, Make_Order, Processing_Order_Count, Recent_Four_Orders, Total_Order_Count, View_Admin_Orders, View_Delivery_Orders, View_My_Orders, View_Orders_ByUser } from "../controllers/orderController.js";


const orderRouter = express.Router();


orderRouter.post("/make_order", Make_Order);
orderRouter.get("/my_orders", View_My_Orders);
orderRouter.get("/admin_orders", View_Admin_Orders);
orderRouter.get("/view_orders/:user_id", View_Orders_ByUser);
orderRouter.put("/accept_order/:order_id", Accept_Order);
orderRouter.put("/complete_order/:order_id", Complete_Order);
orderRouter.get("/delivry_orders", View_Delivery_Orders);
orderRouter.put("/cancel_order/:order_id", Cancel_Order);
orderRouter.get("/count-total", Total_Order_Count);
orderRouter.get("/count-processing", Processing_Order_Count);
orderRouter.get("/recent-four", Recent_Four_Orders);
orderRouter.get("/user-stats/:user_id", Get_User_Order_Stats);




export default orderRouter;