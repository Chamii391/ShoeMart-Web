import { pool } from "../db.js";
import bcrypt from "bcryptjs"


export async function Createuser(req,res){
    
    try{

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const sql = "INSERT INTO users (firstname, lastname, username, password, role) VALUES (?, ?, ?, ?, ?)";

        await pool.query(sql,[
            req.body.firstname,
            req.body.lastname,
            req.body.username,
            hashedPassword,
            req.body.role
        ])

        res.status(201).json({message:"User created successfully"})
     
    }catch(error){
        console.error(error);
        res.status(500).json({
            message:"Error creating user",
            error:error.message
        })
    }
    }
