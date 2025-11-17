// controllers/productController.js
import { pool } from "../db.js";

const ALLOWED_CATEGORIES = ["men", "women", "child"];
const ALLOWED_STATUS = ["active", "inactive"];

export async function Add_Product(req, res) {
  try {
    const {
      name,
      altNames,
      description,
      main_category,
      price,
      stock,
      size,
      color,
      country,
      images,
      isActive,
    } = req.body;

    // Basic validation
    if (!name || !main_category || price == null) {
      return res.status(400).json({
        message: "name, main_category and price are required",
      });
    }

    // Validate category
    if (!ALLOWED_CATEGORIES.includes(main_category)) {
      return res.status(400).json({
        message: "Invalid main_category. Allowed: men, women, child",
      });
    }

    // Validate status or set default
    let status = isActive || "active";
    if (!ALLOWED_STATUS.includes(status)) {
      status = "active";
    }

    // Prepare images value for JSON column
    let imagesValue = null;
    if (images) {
      // You can send an array or object in the body
      imagesValue = JSON.stringify(images);
    }

    const sql = `
      INSERT INTO products
        (name, altNames, description, main_category, price, stock,
         size, color, country, images, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      name,
      altNames || null,
      description || null,
      main_category,
      price,
      stock != null ? stock : 0,
      size || null,
      color || null,
      country || null,
      imagesValue,
      status,
    ];

    await pool.query(sql, params);

    return res.status(201).json({
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      message: "Error adding product",
    });
  }
}