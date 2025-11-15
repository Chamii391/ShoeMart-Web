import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db.js";
import userRouter from "./routers/userRouter.js";


const app = express();

app.use(bodyParser.json());

connectDB();






app.use("/api/users",userRouter)


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})