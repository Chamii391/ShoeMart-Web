import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import { connectDB } from "./db.js";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import feedbackRouter from "./routers/feedbackrouter.js";





const app = express();


app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    const tokenString = req.header("Authorization");

    if (tokenString) {
        const token = tokenString.replace("Bearer ", "");

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (!err) {
                req.user = decoded; // Attach decoded token to request
            } else {
                console.error("Invalid token:", err.message); // Log the error
            }
            next(); // Continue processing the request
        });
    } else {
        next(); // Proceed without a token (guest access)
    }
});








app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/orders",orderRouter)
app.use("/api/feedbacks",feedbackRouter)



connectDB();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})