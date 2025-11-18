import { pool } from "../db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export async function Createuser(req, res) {
  try {
    const { firstname, lastname, username, password, role } = req.body;

    // Basic validation
    if (!firstname || !lastname || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert query
    const sql = `
      INSERT INTO users (firstname, lastname, username, password, role, isActive)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      firstname,
      lastname,
      username,
      hashedPassword,
      role || "customer",     // default role
      "active"                // default active status
    ]);

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
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
            role:user.role,
            userid:user.userid
        })
        
    }catch(error){
        console.error(error);
        res.status(500).json({
            message:"Error logging in",
            error:error.message
        })
    }
}

export async function isAdmin(userId) {
  const [rows] = await pool.query(
    "SELECT role FROM users WHERE userid = ? AND isActive = 'active'",
    [userId]
  );

  if (rows.length === 0) {
    return false; // user not found or not active
  }

  return rows[0].role === "admin";
}

export async function isCustomer(userId) {
  const [rows] = await pool.query(
    "SELECT role FROM users WHERE userid = ? AND isActive = 'active'",
    [userId]
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0].role === "customer";
}


export async function isDelivery(userId) {
  const [rows] = await pool.query(
    "SELECT role FROM users WHERE userid = ? AND isActive = 'active'",
    [userId]
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0].role === "delivery";
}