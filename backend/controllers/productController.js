// controllers/productController.js
import { pool } from "../db.js";

const ALLOWED_CATEGORIES = ["men", "women", "child"];
const ALLOWED_STATUS = ["active", "inactive"];

export async function Add_Product(req, res) {
  let connection;

  try {
    const {
      name,
      altNames,
      description,
      main_category,
      price,
      color,
      country,
      images,
      isActive,
      sizes, // <-- array of { size_value, stock }
    } = req.body;

    // Basic validation
    if (!name || !main_category || price == null) {
      return res.status(400).json({
        message: "name, main_category and price are required",
      });
    }

    if (!ALLOWED_CATEGORIES.includes(main_category)) {
      return res.status(400).json({
        message: "Invalid main_category. Allowed: men, women, child",
      });
    }

    // Validate or default status
    let status = isActive || "active";
    if (!ALLOWED_STATUS.includes(status)) {
      status = "active";
    }

    // Validate sizes (optional but recommended)
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({
        message: "At least one size with stock is required",
      });
    }

    // Prepare images JSON
    const imagesValue = images ? JSON.stringify(images) : null;

    // Start transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1) Insert into products
    const insertProductSql = `
      INSERT INTO products
        (name, altNames, description, main_category, price,
         color, country, images, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const productParams = [
      name,
      altNames || null,
      description || null,
      main_category,
      price,
      color || null,
      country || null,
      imagesValue,
      status,
    ];

    const [productResult] = await connection.query(
      insertProductSql,
      productParams
    );

    const productId = productResult.insertId;

    // 2) Insert sizes into product_sizes
    const insertSizeSql = `
      INSERT INTO product_sizes (product_id, size_value, stock)
      VALUES (?, ?, ?)
    `;

    for (const s of sizes) {
      if (!s.size_value || s.stock == null) {
        // skip invalid entries
        continue;
      }

      await connection.query(insertSizeSql, [
        productId,
        s.size_value,
        s.stock,
      ]);
    }

    await connection.commit();

    return res.status(201).json({
      message: "Product added successfully",
      product_id: productId,
    });
  } catch (error) {
    console.error("Error adding product:", error);

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }

    return res.status(500).json({
      message: "Error adding product",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function View_Products(req, res) {
  try {
    const sql = `
      SELECT
        p.product_id,
        p.name,
        p.altNames,
        p.description,
        p.main_category,
        p.price,
        p.color,
        p.country,
        p.images,
        p.isActive,
        p.created_at,
        ps.size_id,
        ps.size_value,
        ps.stock
      FROM products p
      LEFT JOIN product_sizes ps
        ON p.product_id = ps.product_id
      WHERE p.isActive = 'active'
      ORDER BY p.product_id, ps.size_value
    `;

    const [rows] = await pool.query(sql);

    const productsMap = new Map();

    for (const row of rows) {
      if (!productsMap.has(row.product_id)) {
        // Parse images JSON if present
        let images = null;
        if (row.images) {
          try {
            images = JSON.parse(row.images);
          } catch (err) {
            console.error("Error parsing images JSON for product", row.product_id, err.message);
            images = null;
          }
        }

        productsMap.set(row.product_id, {
          product_id: row.product_id,
          name: row.name,
          altNames: row.altNames,
          description: row.description,
          main_category: row.main_category,
          price: row.price,
          color: row.color,
          country: row.country,
          images,
          isActive: row.isActive,
          created_at: row.created_at,
          sizes: []
        });
      }

      // Add size info if exists
      if (row.size_id) {
        const product = productsMap.get(row.product_id);
        product.sizes.push({
          //size_id: row.size_id,
          size_value: row.size_value,
          stock: row.stock
        });
      }
    }

    const products = Array.from(productsMap.values());

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products with sizes:", error);
    return res.status(500).json({
      message: "Error fetching products"
    });
  }
}


export async function Update_Product_Details(req, res) {
  let connection;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const {
      name,
      altNames,
      description,
      main_category,
      price,
      color,
      country,
      images,
      isActive,
      sizes // optional: array of { size_value, stock }
    } = req.body;

    connection = await pool.getConnection();

    // Check product exists
    const [existingRows] = await connection.query(
      "SELECT * FROM products WHERE product_id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Product not found" });
    }

    const fields = [];
    const params = [];

    // Build dynamic SET for products table
    if (name !== undefined) {
      fields.push("name = ?");
      params.push(name);
    }

    if (altNames !== undefined) {
      fields.push("altNames = ?");
      params.push(altNames);
    }

    if (description !== undefined) {
      fields.push("description = ?");
      params.push(description);
    }

    if (main_category !== undefined) {
      if (!ALLOWED_CATEGORIES.includes(main_category)) {
        return res.status(400).json({
          message: "Invalid main_category. Allowed: men, women, child"
        });
      }
      fields.push("main_category = ?");
      params.push(main_category);
    }

    if (price !== undefined) {
      fields.push("price = ?");
      params.push(price);
    }

    if (color !== undefined) {
      fields.push("color = ?");
      params.push(color);
    }

    if (country !== undefined) {
      fields.push("country = ?");
      params.push(country);
    }

    if (images !== undefined) {
      const imagesValue = images ? JSON.stringify(images) : null;
      fields.push("images = ?");
      params.push(imagesValue);
    }

    if (isActive !== undefined) {
      let status = isActive;
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({
          message: "Invalid isActive. Allowed: active, inactive"
        });
      }
      fields.push("isActive = ?");
      params.push(status);
    }

    if (fields.length === 0 && !Array.isArray(sizes)) {
      return res
        .status(400)
        .json({ message: "No fields provided to update" });
    }

    await connection.beginTransaction();

    // 1) Update products table (if any fields)
    if (fields.length > 0) {
      const updateProductSql = `
        UPDATE products
        SET ${fields.join(", ")}
        WHERE product_id = ?
      `;
      params.push(id);
      await connection.query(updateProductSql, params);
    }

    // 2) Update sizes if provided (replace existing sizes for this product)
    if (Array.isArray(sizes)) {
      // delete old sizes
      await connection.query(
        "DELETE FROM product_sizes WHERE product_id = ?",
        [id]
      );

      const insertSizeSql = `
        INSERT INTO product_sizes (product_id, size_value, stock)
        VALUES (?, ?, ?)
      `;

      for (const s of sizes) {
        if (!s.size_value || s.stock == null) {
          continue; // skip invalid entries
        }
        await connection.query(insertSizeSql, [
          id,
          s.size_value,
          s.stock
        ]);
      }
    }

    await connection.commit();

    return res.status(200).json({
      message: "Product updated successfully"
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }

    return res.status(500).json({
      message: "Error updating product"
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


export async function Delete_Product(req, res) {
  let connection;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    connection = await pool.getConnection();

    // Check product exists
    const [existingRows] = await connection.query(
      "SELECT product_id FROM products WHERE product_id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Product not found" });
    }

    await connection.beginTransaction();

    // 1) Delete all sizes for this product
    await connection.query(
      "DELETE FROM product_sizes WHERE product_id = ?",
      [id]
    );

    // 2) Delete product itself
    const [result] = await connection.query(
      "DELETE FROM products WHERE product_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: "Product not found" });
    }

    await connection.commit();

    return res.status(200).json({
      message: "Product and its sizes deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }

    return res.status(500).json({
      message: "Error deleting product",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}



