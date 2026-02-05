// controllers/productController.js
import { pool } from "../db.js";
import { generateAltNamesAI, generateDescriptionAI } from "../services/aiService.js";

const ALLOWED_CATEGORIES = ["men", "women", "child"];
const ALLOWED_STATUS = ["active", "inactive"];

// ==========================
// VALIDATION HELPER FUNCTIONS
// ==========================

function validateProductName(name) {
  // Name: 2-100 characters
  return name && name.trim().length >= 2 && name.trim().length <= 100;
}

function validatePrice(price) {
  // Price: must be a positive number
  return price !== null && price !== undefined && !isNaN(price) && Number(price) > 0;
}

function validateStock(stock) {
  // Stock: must be 0 or positive integer
  return stock !== null && stock !== undefined && !isNaN(stock) && Number(stock) >= 0 && Number.isInteger(Number(stock));
}

function validateSizeValue(size_value) {
  // Size: non-empty string, max 20 chars (e.g., "S", "M", "L", "XL", "42", "10.5")
  return size_value && size_value.trim().length > 0 && size_value.trim().length <= 20;
}

function validateColor(color) {
  // Color: 2-30 characters, letters and spaces only
  if (!color) return true; // optional field
  const colorRegex = /^[a-zA-Z\s]{2,30}$/;
  return colorRegex.test(color);
}

function validateCountry(country) {
  // Country: 2-50 characters
  if (!country) return true; // optional field
  return country.trim().length >= 2 && country.trim().length <= 50;
}

function validateImages(images) {
  // Images: must be array of valid URLs (if provided)
  if (!images) return true; // optional
  if (!Array.isArray(images)) return false;
  
  const urlRegex = /^(https?:\/\/)/i;
  for (const img of images) {
    if (typeof img !== "string" || !urlRegex.test(img)) {
      return false;
    }
  }
  return true;
}

function validateDescription(description) {
  // Description: max 2000 characters
  if (!description) return true; // optional
  return description.trim().length <= 2000;
}

function validateAltNames(altNames) {
  // AltNames: max 500 characters
  if (!altNames) return true; // optional
  return altNames.trim().length <= 500;
}

function validateProductId(id) {
  // ID: must be positive integer
  return id && !isNaN(id) && Number(id) > 0 && Number.isInteger(Number(id));
}

function validateSizesArray(sizes) {
  // Sizes: must be non-empty array with valid entries
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return { valid: false, message: "At least one size with stock is required" };
  }

  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i];
    
    if (!s.size_value || !validateSizeValue(s.size_value)) {
      return { 
        valid: false, 
        message: `Invalid size_value at index ${i}. Must be 1-20 characters` 
      };
    }
    
    if (s.stock === null || s.stock === undefined || !validateStock(s.stock)) {
      return { 
        valid: false, 
        message: `Invalid stock at index ${i}. Must be 0 or positive integer` 
      };
    }
  }

  return { valid: true };
}

// ==========================
// ADD PRODUCT
// ==========================
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
      sizes,
    } = req.body;

    // ===== VALIDATIONS =====

    // Required fields check
    if (!name || !main_category || price === null || price === undefined) {
      return res.status(400).json({
        message: "name, main_category and price are required",
      });
    }

    // Validate product name
    if (!validateProductName(name)) {
      return res.status(400).json({
        message: "Product name must be 2-100 characters",
      });
    }

    // Validate category
    if (!ALLOWED_CATEGORIES.includes(main_category)) {
      return res.status(400).json({
        message: "Invalid main_category. Allowed: men, women, child",
      });
    }

    // Validate price
    if (!validatePrice(price)) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    // Validate color (optional)
    if (color && !validateColor(color)) {
      return res.status(400).json({
        message: "Color must be 2-30 characters (letters only)",
      });
    }

    // Validate country (optional)
    if (country && !validateCountry(country)) {
      return res.status(400).json({
        message: "Country must be 2-50 characters",
      });
    }

    // Validate description (optional)
    if (description && !validateDescription(description)) {
      return res.status(400).json({
        message: "Description must be less than 2000 characters",
      });
    }

    // Validate altNames (optional)
    if (altNames && !validateAltNames(altNames)) {
      return res.status(400).json({
        message: "AltNames must be less than 500 characters",
      });
    }

    // Validate images (optional)
    if (images && !validateImages(images)) {
      return res.status(400).json({
        message: "Images must be an array of valid URLs",
      });
    }

    // Validate sizes array
    const sizesValidation = validateSizesArray(sizes);
    if (!sizesValidation.valid) {
      return res.status(400).json({
        message: sizesValidation.message,
      });
    }

    // Validate status
    let status = isActive || "active";
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        message: "Invalid isActive. Allowed: active, inactive",
      });
    }

    // Check for duplicate product name (optional but recommended)
    const [existingProduct] = await pool.query(
      "SELECT product_id FROM products WHERE LOWER(name) = LOWER(?)",
      [name.trim()]
    );

    if (existingProduct.length > 0) {
      return res.status(409).json({
        message: "Product with this name already exists",
      });
    }

    // ===== INSERT PRODUCT =====

    const imagesValue = images ? JSON.stringify(images) : null;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const insertProductSql = `
      INSERT INTO products
        (name, altNames, description, main_category, price,
         color, country, images, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const productParams = [
      name.trim(),
      altNames ? altNames.trim() : null,
      description ? description.trim() : null,
      main_category,
      Number(price),
      color ? color.trim() : null,
      country ? country.trim() : null,
      imagesValue,
      status,
    ];

    const [productResult] = await connection.query(
      insertProductSql,
      productParams
    );

    const productId = productResult.insertId;

    // Insert sizes
    const insertSizeSql = `
      INSERT INTO product_sizes (product_id, size_value, stock)
      VALUES (?, ?, ?)
    `;

    for (const s of sizes) {
      await connection.query(insertSizeSql, [
        productId,
        s.size_value.trim(),
        Number(s.stock),
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

// ==========================
// VIEW ALL PRODUCTS
// ==========================
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

      if (row.size_id) {
        const product = productsMap.get(row.product_id);
        product.sizes.push({
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

// ==========================
// VIEW PRODUCT BY ID
// ==========================
export async function View_Product_ById(req, res) {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!validateProductId(id)) {
      return res.status(400).json({ 
        message: "Valid Product ID is required (positive integer)" 
      });
    }

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
      WHERE p.product_id = ? AND p.isActive = 'active'
    `;

    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const first = rows[0];

    let images = [];
    try {
      images = JSON.parse(first.images);
    } catch {
      images = [];
    }

    const product = {
      product_id: first.product_id,
      name: first.name,
      altNames: first.altNames,
      description: first.description,
      main_category: first.main_category,
      price: first.price,
      color: first.color,
      country: first.country,
      images,
      isActive: first.isActive,
      created_at: first.created_at,
      sizes: []
    };

    for (const row of rows) {
      if (row.size_value) {
        product.sizes.push({
          size_value: row.size_value,
          stock: row.stock
        });
      }
    }

    return res.status(200).json(product);

  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      message: "Error fetching product"
    });
  }
}

// ==========================
// UPDATE PRODUCT
// ==========================
export async function Update_Product_Details(req, res) {
  let connection;

  try {
    const { id } = req.params;

    // Validate product ID
    if (!validateProductId(id)) {
      return res.status(400).json({ 
        message: "Valid Product ID is required (positive integer)" 
      });
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
      sizes
    } = req.body;

    // ===== VALIDATIONS =====

    // Validate name (if provided)
    if (name !== undefined && !validateProductName(name)) {
      return res.status(400).json({
        message: "Product name must be 2-100 characters",
      });
    }

    // Validate category (if provided)
    if (main_category !== undefined && !ALLOWED_CATEGORIES.includes(main_category)) {
      return res.status(400).json({
        message: "Invalid main_category. Allowed: men, women, child"
      });
    }

    // Validate price (if provided)
    if (price !== undefined && !validatePrice(price)) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    // Validate color (if provided)
    if (color !== undefined && color !== null && color !== "" && !validateColor(color)) {
      return res.status(400).json({
        message: "Color must be 2-30 characters (letters only)",
      });
    }

    // Validate country (if provided)
    if (country !== undefined && country !== null && country !== "" && !validateCountry(country)) {
      return res.status(400).json({
        message: "Country must be 2-50 characters",
      });
    }

    // Validate description (if provided)
    if (description !== undefined && description !== null && !validateDescription(description)) {
      return res.status(400).json({
        message: "Description must be less than 2000 characters",
      });
    }

    // Validate altNames (if provided)
    if (altNames !== undefined && altNames !== null && !validateAltNames(altNames)) {
      return res.status(400).json({
        message: "AltNames must be less than 500 characters",
      });
    }

    // Validate images (if provided)
    if (images !== undefined && images !== null && !validateImages(images)) {
      return res.status(400).json({
        message: "Images must be an array of valid URLs",
      });
    }

    // Validate isActive (if provided)
    if (isActive !== undefined && !ALLOWED_STATUS.includes(isActive)) {
      return res.status(400).json({
        message: "Invalid isActive. Allowed: active, inactive"
      });
    }

    // Validate sizes (if provided)
    if (sizes !== undefined) {
      if (!Array.isArray(sizes)) {
        return res.status(400).json({
          message: "Sizes must be an array",
        });
      }
      
      if (sizes.length > 0) {
        const sizesValidation = validateSizesArray(sizes);
        if (!sizesValidation.valid) {
          return res.status(400).json({
            message: sizesValidation.message,
          });
        }
      }
    }

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

    // Check duplicate name (if updating name)
    if (name !== undefined) {
      const [duplicateName] = await connection.query(
        "SELECT product_id FROM products WHERE LOWER(name) = LOWER(?) AND product_id != ?",
        [name.trim(), id]
      );

      if (duplicateName.length > 0) {
        connection.release();
        return res.status(409).json({
          message: "Another product with this name already exists",
        });
      }
    }

    const fields = [];
    const params = [];

    if (name !== undefined) {
      fields.push("name = ?");
      params.push(name.trim());
    }

    if (altNames !== undefined) {
      fields.push("altNames = ?");
      params.push(altNames ? altNames.trim() : null);
    }

    if (description !== undefined) {
      fields.push("description = ?");
      params.push(description ? description.trim() : null);
    }

    if (main_category !== undefined) {
      fields.push("main_category = ?");
      params.push(main_category);
    }

    if (price !== undefined) {
      fields.push("price = ?");
      params.push(Number(price));
    }

    if (color !== undefined) {
      fields.push("color = ?");
      params.push(color ? color.trim() : null);
    }

    if (country !== undefined) {
      fields.push("country = ?");
      params.push(country ? country.trim() : null);
    }

    if (images !== undefined) {
      const imagesValue = images ? JSON.stringify(images) : null;
      fields.push("images = ?");
      params.push(imagesValue);
    }

    if (isActive !== undefined) {
      fields.push("isActive = ?");
      params.push(isActive);
    }

    if (fields.length === 0 && !Array.isArray(sizes)) {
      connection.release();
      return res.status(400).json({ 
        message: "No valid fields provided to update" 
      });
    }

    await connection.beginTransaction();

    // Update products table
    if (fields.length > 0) {
      const updateProductSql = `
        UPDATE products
        SET ${fields.join(", ")}
        WHERE product_id = ?
      `;
      params.push(id);
      await connection.query(updateProductSql, params);
    }

    // Update sizes if provided
    if (Array.isArray(sizes)) {
      await connection.query(
        "DELETE FROM product_sizes WHERE product_id = ?",
        [id]
      );

      if (sizes.length > 0) {
        const insertSizeSql = `
          INSERT INTO product_sizes (product_id, size_value, stock)
          VALUES (?, ?, ?)
        `;

        for (const s of sizes) {
          await connection.query(insertSizeSql, [
            id,
            s.size_value.trim(),
            Number(s.stock)
          ]);
        }
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

// ==========================
// DELETE PRODUCT
// ==========================
export async function Delete_Product(req, res) {
  let connection;

  try {
    const { id } = req.params;

    // Validate product ID
    if (!validateProductId(id)) {
      return res.status(400).json({ 
        message: "Valid Product ID is required (positive integer)" 
      });
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

    // Delete sizes first (foreign key)
    await connection.query(
      "DELETE FROM product_sizes WHERE product_id = ?",
      [id]
    );

    // Delete product
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

// ==========================
// INCREASE PRODUCT VIEWS
// ==========================
export async function Increase_Product_Views(req, res) {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!validateProductId(id)) {
      return res.status(400).json({ 
        message: "Valid product_id is required (positive integer)" 
      });
    }

    // Check product exists
    const [existing] = await pool.query(
      "SELECT product_id FROM products WHERE product_id = ? AND isActive = 'active'",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await pool.query(
      "UPDATE products SET views = views + 1 WHERE product_id = ?",
      [id]
    );

    return res.status(200).json({ message: "View counted" });

  } catch (error) {
    console.error("Error updating views:", error);
    return res.status(500).json({ message: "Error", error: error.message });
  }
}

// ==========================
// GET TOP VIEWED PRODUCTS
// ==========================
export async function Get_Top_Viewed_Products(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT product_id, name, price, images, views 
      FROM products
      WHERE isActive = 'active'
      ORDER BY views DESC
      LIMIT 8
      `
    );

    const products = rows.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    return res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching top viewed products:", error);
    return res.status(500).json({
      message: "Failed to load top viewed products",
      error: error.message
    });
  }
}

// ==========================
// GET PRODUCT COUNT
// ==========================
export async function Get_Product_Count(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT COUNT(*) AS total_products
      FROM products
      WHERE isActive = 'active'
    `);

    return res.status(200).json({
      total_products: rows[0].total_products
    });

  } catch (error) {
    console.error("Error fetching product count:", error);
    return res.status(500).json({
      message: "Error fetching product count",
      error: error.message
    });
  }
}

// ==========================
// GET LOW STOCK PRODUCTS
// ==========================
export async function Get_Low_Stock_Products(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.product_id,
        p.name,
        p.images,
        ps.size_value,
        ps.stock
      FROM product_sizes ps
      INNER JOIN products p ON p.product_id = ps.product_id
      WHERE p.isActive = 'active'
      ORDER BY ps.stock ASC
      LIMIT 4
      `
    );

    const products = rows.map((row) => {
      let image = null;

      if (row.images) {
        try {
          const imgs = JSON.parse(row.images);
          if (Array.isArray(imgs) && imgs.length > 0) {
            image = imgs[0];
          } else if (typeof imgs === "string") {
            image = imgs;
          }
        } catch (e) {
          image = null;
        }
      }

      return {
        product_id: row.product_id,
        name: row.name,
        size_value: row.size_value,
        stock: row.stock,
        image,
      };
    });

    return res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return res.status(500).json({
      message: "Error fetching low stock products",
      error: error.message,
    });
  }
}

// ==========================
// GET NEWLY ADDED PRODUCTS
// ==========================
export async function Get_Newly_Added_Products(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        product_id,
        name,
        price,
        images,
        main_category,
        created_at
      FROM products
      WHERE isActive = 'active'
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const products = rows.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    return res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching newly added products:", error);
    return res.status(500).json({
      message: "Failed to load newly added products",
      error: error.message
    });
  }
}

// ==========================
// GENERATE ALT NAMES (AI)
// ==========================
export async function Generate_AltNames(req, res) {
  try {
    const { name, main_category, color, country } = req.body;

    // Validate required fields
    if (!name || !main_category) {
      return res.status(400).json({
        message: "name and main_category are required"
      });
    }

    // Validate name
    if (!validateProductName(name)) {
      return res.status(400).json({
        message: "Product name must be 2-100 characters"
      });
    }

    // Validate category
    if (!ALLOWED_CATEGORIES.includes(main_category)) {
      return res.status(400).json({
        message: "Invalid main_category. Allowed: men, women, child"
      });
    }

    const altNames = await generateAltNamesAI({
      name: name.trim(),
      main_category,
      color: color ? color.trim() : null,
      country: country ? country.trim() : null
    });

    return res.status(200).json({ altNames });

  } catch (error) {
    console.error("Generate altNames error:", error.message);
    return res.status(500).json({
      message: "Failed to generate altNames"
    });
  }
}

// ==========================
// GENERATE DESCRIPTION (AI)
// ==========================
export async function Generate_Description(req, res) {
  try {
    const { name, main_category, price, color, country } = req.body;

    // Validate required fields
    if (!name || !main_category || price === null || price === undefined) {
      return res.status(400).json({
        message: "name, main_category and price are required"
      });
    }

    // Validate name
    if (!validateProductName(name)) {
      return res.status(400).json({
        message: "Product name must be 2-100 characters"
      });
    }

    // Validate category
    if (!ALLOWED_CATEGORIES.includes(main_category)) {
      return res.status(400).json({
        message: "Invalid main_category. Allowed: men, women, child"
      });
    }

    // Validate price
    if (!validatePrice(price)) {
      return res.status(400).json({
        message: "Price must be a positive number"
      });
    }

    const description = await generateDescriptionAI({
      name: name.trim(),
      main_category,
      price: Number(price),
      color: color ? color.trim() : null,
      country: country ? country.trim() : null
    });

    return res.status(200).json({ description });

  } catch (error) {
    console.error("Generate description error:", error.message);
    return res.status(500).json({
      message: "Failed to generate description"
    });
  }
}