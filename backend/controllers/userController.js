import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==========================
// VALIDATION HELPER FUNCTIONS
// ==========================

function validateUsername(username) {
  // Username: 3-30 chars, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

function validatePassword(password) {
  // Password: minimum 6 characters
  return password && password.length >= 6;
}

function validateName(name) {
  // Name: 2-50 chars, letters only
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
}

function validateRole(role) {
  const validRoles = ["customer", "admin", "delivery"];
  return validRoles.includes(role);
}

// ==========================
// CREATE USER
// ==========================
export async function Createuser(req, res) {
  try {
    const { firstname, lastname, username, password, role } = req.body;

    // Check required fields
    if (!firstname || !lastname || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate firstname
    if (!validateName(firstname)) {
      return res.status(400).json({ 
        message: "Firstname must be 2-50 characters and letters only" 
      });
    }

    // Validate lastname
    if (!validateName(lastname)) {
      return res.status(400).json({ 
        message: "Lastname must be 2-50 characters and letters only" 
      });
    }

    // Validate username
    if (!validateUsername(username)) {
      return res.status(400).json({ 
        message: "Username must be 3-30 characters (letters, numbers, underscore only)" 
      });
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Validate role (if provided)
    if (role && !validateRole(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Must be: customer, admin, or delivery" 
      });
    }

    // Check if username already exists
    const [existingUser] = await pool.query(
      "SELECT userid FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert query
    const sql = `
      INSERT INTO users (firstname, lastname, username, password, role, isActive)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      firstname.trim(),
      lastname.trim(),
      username.trim().toLowerCase(),
      hashedPassword,
      role || "customer",
      "active"
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

// ==========================
// LOGIN
// ==========================
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate username format
    if (!validateUsername(username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }

    const sql = "SELECT * FROM users WHERE username = ? AND isActive = 'active'";
    const [rows] = await pool.query(sql, [username.trim().toLowerCase()]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userid: user.userid,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      role: user.role,
      userid: user.userid,
      username: user.username
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message
    });
  }
}

// ==========================
// ROLE CHECK FUNCTIONS
// ==========================
export async function isAdmin(userId) {
  if (!userId || isNaN(userId)) {
    return false;
  }

  const [rows] = await pool.query(
    "SELECT role FROM users WHERE userid = ? AND isActive = 'active'",
    [userId]
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0].role === "admin";
}

export async function isCustomer(userId) {
  if (!userId || isNaN(userId)) {
    return false;
  }

  const [rows] = await pool.query(
    "SELECT role FROM users WHERE userid = ? AND isActive = 'active'",
    [userId]
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0].role === "customer";
}

export async function isDelivery(userId) {
  if (!userId || isNaN(userId)) {
    return false;
  }

  const [rows] = await pool.query(
    "SELECT role FROM users WHERE userid = ? AND isActive = 'active'",
    [userId]
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0].role === "delivery";
}

// ==========================
// VIEW USER DETAILS
// ==========================
export async function viewUserDetails(req, res) {
  try {
    const { userid } = req.params;

    // Validate userid
    if (!userid || isNaN(userid)) {
      return res.status(400).json({ message: "Valid user ID is required" });
    }

    const sql = `
      SELECT userid, firstname, lastname, username, role, isActive
      FROM users
      WHERE userid = ? AND isActive = 'active'
    `;

    const [rows] = await pool.query(sql, [userid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving user details",
      error: error.message,
    });
  }
}

// ==========================
// UPDATE USER
// ==========================
export async function updateUser(req, res) {
  try {
    const { userid } = req.params;
    const { firstname, lastname, username, password } = req.body;

    // Validate userid
    if (!userid || isNaN(userid)) {
      return res.status(400).json({ message: "Valid user ID is required" });
    }

    // Check required fields
    if (!firstname || !lastname || !username) {
      return res.status(400).json({ 
        message: "firstname, lastname, username required" 
      });
    }

    // Validate firstname
    if (!validateName(firstname)) {
      return res.status(400).json({ 
        message: "Firstname must be 2-50 characters and letters only" 
      });
    }

    // Validate lastname
    if (!validateName(lastname)) {
      return res.status(400).json({ 
        message: "Lastname must be 2-50 characters and letters only" 
      });
    }

    // Validate username
    if (!validateUsername(username)) {
      return res.status(400).json({ 
        message: "Username must be 3-30 characters (letters, numbers, underscore only)" 
      });
    }

    // Validate password (only if provided)
    if (password && password.trim() !== "" && !validatePassword(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Get current user
    const [rows] = await pool.query(
      "SELECT password FROM users WHERE userid = ? AND isActive = 'active'",
      [userid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new username already exists (for another user)
    const [existingUser] = await pool.query(
      "SELECT userid FROM users WHERE username = ? AND userid != ?",
      [username.trim().toLowerCase(), userid]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    let finalPassword = rows[0].password;

    if (password && password.trim() !== "") {
      finalPassword = await bcrypt.hash(password, 10);
    }

    const sql = `
      UPDATE users
      SET firstname = ?, lastname = ?, username = ?, password = ?
      WHERE userid = ?
    `;

    const [result] = await pool.query(sql, [
      firstname.trim(),
      lastname.trim(),
      username.trim().toLowerCase(),
      finalPassword,
      userid,
    ]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "User not updated" });
    }

    res.status(200).json({ message: "Profile updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
}

// ==========================
// TOTAL CUSTOMER COUNT
// ==========================
export async function Total_Customer_Count(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT COUNT(*) AS total_customers
      FROM users
      WHERE role = 'customer' AND isActive = 'active'
    `);

    return res.status(200).json({
      total_customers: rows[0].total_customers
    });

  } catch (error) {
    console.error("Error fetching customer count:", error);
    return res.status(500).json({
      message: "Error fetching customer count",
      error: error.message
    });
  }
}