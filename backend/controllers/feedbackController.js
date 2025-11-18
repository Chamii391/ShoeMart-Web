// controllers/feedbackController.js
import { pool } from "../db.js";
import { isCustomer } from "./userController.js";

// ============================================================
// ADD FEEDBACK
// ============================================================
export async function Add_Feedback(req, res) {
  try {
    // 1) Get user from token
    const user = req.user;
    if (!user || !user.userid) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const userId = user.userid;

    // 2) Check if user is a customer
    const customer = await isCustomer(userId);
    if (!customer) {
      return res.status(403).json({ message: "Only customers can add feedback" });
    }

    // 3) Build full name
    let firstName = user.firstname || "";
    let lastName = user.lastname || "";

    // If name not in token → get from DB
    if (!firstName && !lastName) {
      const [rows] = await pool.query(
        "SELECT firstname, lastname FROM users WHERE userid = ?",
        [userId]
      );

      if (rows.length > 0) {
        firstName = rows[0].firstname || "";
        lastName = rows[0].lastname || "";
      }
    }

    const fullName =
      `${firstName} ${lastName}`.trim() === "" ? "Unknown" : `${firstName} ${lastName}`.trim();

    // 4) Read body values
    const { product_id, comment } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "product_id is required" });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "comment is required" });
    }

    // 5) Check product exists
    const [pRows] = await pool.query(
      "SELECT product_id FROM products WHERE product_id = ?",
      [product_id]
    );

    if (pRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 6) Insert feedback
    await pool.query(
      `
      INSERT INTO feedbacks (user_id, user_name, product_id, comment)
      VALUES (?, ?, ?, ?)
      `,
      [userId, fullName, product_id, comment.trim()]
    );

    return res.status(201).json({
      message: "Feedback added successfully",
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    return res.status(500).json({
      message: "Error adding feedback",
      error: error.message,
    });
  }
}

// ============================================================
// VIEW FEEDBACK
// ============================================================
export async function View_Feedback(req, res) {
  try {
    // Require login
    const user = req.user;
    if (!user || !user.userid) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const productId = req.params.id; // /view_feedback/:id

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check product exists
    const [productRows] = await pool.query(
      "SELECT product_id, name FROM products WHERE product_id = ?",
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productRows[0];

    // Fetch feedback for this product
    const [feedbackRows] = await pool.query(
      `
      SELECT user_name, comment, created_at
      FROM feedbacks
      WHERE product_id = ?
      ORDER BY created_at DESC
      `,
      [productId]
    );

    return res.status(200).json({
      product_id: product.product_id,
      product_name: product.name,
      feedbacks: feedbackRows,
    });
  } catch (error) {
    console.error("Error viewing feedback:", error);
    return res.status(500).json({
      message: "Error viewing feedback",
      error: error.message,
    });
  }
}
