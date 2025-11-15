import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db.js";


const app = express();

app.use(bodyParser.json());

connectDB();








app.listen(3000, () => {
    console.log("Server is running on port 3000");
})