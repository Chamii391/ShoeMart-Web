import { pool } from "../db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


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



export async function login(req,res){


    try{

        const sql = "SELECT * FROM users WHERE username = ?";

        const [rows] = await pool.query(sql,[req.body.username]);

        if(rows.length === 0){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const token = jwt.sign(
            {
                userid:user.userid,
                username:user.username,
                role:user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn:"1h"
            }
        );

        res.status(200).json({
            message:"Login successful",
            token:token,
            role:user.role
        })
        
    }catch(error){
        console.error(error);
        res.status(500).json({
            message:"Error logging in",
            error:error.message
        })
    }
}