import express from "express";
import { Add_Feedback, View_Feedback } from "../controllers/feedbackController.js";


const feedbackRouter = express.Router();

feedbackRouter.post("/add_feedback", Add_Feedback);
feedbackRouter.get("/view_feedback/:id", View_Feedback); // id = product_id


export default feedbackRouter;