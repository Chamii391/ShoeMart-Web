import { isAdmin, isCustomer, isDelivery } from "./userController.js";
import { pool } from "../db.js";

// ==========================
// VALIDATION HELPER FUNCTIONS
// ==========================

function validatePhone(phone) {
  // Phone: 10-15 digits, can start with + or 0
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  return phone && phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

function validateAddress(address) {
  // Address: 10-500 characters
  return address && address.trim().length >= 10 && address.trim().length <= 500;
}

function validateDescription(description) {
  // Description: max 1000 characters (optional)
  if (!description) return true;
  return description.trim().length <= 1000;
}

function validateQuantity(quantity) {
  // Quantity: positive integer
  const qty = Number(quantity);
  return !isNaN(qty) && qty > 0 && Number.isInteger(qty);
}

function validateProductId(id) {
  // Product ID: positive integer
  const numId = Number(id);
  return numId && !isNaN(numId) && numId > 0 && Number.isInteger(numId);
}

function validateOrderId(id) {
  // Order ID: positive integer
  const numId = Number(id);
  return numId && !isNaN(numId) && numId > 0 && Number.isInteger(numId);
}

function validateUserId(id) {
  // User ID: positive integer
  const numId = Number(id);
  return numId && !isNaN(numId) && numId > 0 && Number.isInteger(numId);
}

function validateSizeValue(size_value) {
  // Size: non-empty string, max 20 chars
  return size_value && size_value.trim().length > 0 && size_value.trim().length <= 20;
}

function validateItemsArray(items) {
  // Items validation
  if (!Array.isArray(items)) {
    return { valid: false, message: "Items must be an array" };
  }

  if (items.length === 0) {
    return { valid: false, message: "Items array cannot be empty" };
  }

  if (items.length > 50) {
    return { valid: false, message: "Maximum 50 items per order allowed" };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Check required fields
    if (!item.product_id) {
      return {
        valid: false,
        message: `Item at index ${i}: product_id is required`
      };
    }

    if (!validateProductId(item.product_id)) {
      return {
        valid: false,
        message: `Item at index ${i}: product_id must be a positive integer`
      };
    }

    if (!item.size_value) {
      return {
        valid: false,
        message: `Item at index ${i}: size_value is required`
      };
    }

    if (!validateSizeValue(item.size_value)) {
      return {
        valid: false,
        message: `Item at index ${i}: size_value must be 1-20 characters`
      };
    }

    if (item.quantity === null || item.quantity === undefined) {
      return {
        valid: false,
        message: `Item at index ${i}: quantity is required`
      };
    }

    if (!validateQuantity(item.quantity)) {
      return {
        valid: false,
        message: `Item at index ${i}: quantity must be a positive integer`
      };
    }

    // Optional: max quantity per item
    if (Number(item.quantity) > 100) {
      return {
        valid: false,
        message: `Item at index ${i}: maximum quantity per item is 100`
      };
    }
  }

  return { valid: true };
}

// ==========================
// MAKE ORDER
// ==========================
export async function Make_Order(req, res) {
  let connection;

  try {
    // 1) Get user info from token
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const userId = user.userid;

    // Validate userId
    if (!validateUserId(userId)) {
      return res.status(400).json({ 
        message: "Invalid user ID" 
      });
    }

    // Build full name safely
    let firstName = user.firstname || "";
    let lastName = user.lastname || "";

    if (!firstName && !lastName) {
      const [userRows] = await pool.query(
        "SELECT firstname, lastname FROM users WHERE userid = ? AND isActive = 'active'",
        [userId]
      );

      if (userRows.length > 0) {
        firstName = userRows[0].firstname || "";
        lastName = userRows[0].lastname || "";
      }
    }

    const fullName = `${firstName} ${lastName}`.trim();

    // 2) Check role
    const customer = await isCustomer(userId);
    if (!customer) {
      return res.status(403).json({ 
        message: "Only customers can place orders" 
      });
    }

    // 3) Read and validate data
    const { customer_address, customer_phone, description, items } = req.body;

    // Validate required fields
    if (!customer_address) {
      return res.status(400).json({ 
        message: "Customer address is required" 
      });
    }

    if (!customer_phone) {
      return res.status(400).json({ 
        message: "Customer phone is required" 
      });
    }

    // Validate address
    if (!validateAddress(customer_address)) {
      return res.status(400).json({ 
        message: "Address must be 10-500 characters" 
      });
    }

    // Validate phone
    if (!validatePhone(customer_phone)) {
      return res.status(400).json({ 
        message: "Invalid phone number. Must be 10-15 digits" 
      });
    }

    // Validate description (optional)
    if (description && !validateDescription(description)) {
      return res.status(400).json({ 
        message: "Description must be less than 1000 characters" 
      });
    }

    // Validate items array
    const itemsValidation = validateItemsArray(items);
    if (!itemsValidation.valid) {
      return res.status(400).json({ 
        message: itemsValidation.message 
      });
    }

    // Check for duplicate items (same product_id + size_value)
    const itemKeys = new Set();
    for (const item of items) {
      const key = `${item.product_id}-${item.size_value}`;
      if (itemKeys.has(key)) {
        return res.status(400).json({
          message: `Duplicate item found: product_id ${item.product_id} with size ${item.size_value}. Please combine quantities instead.`
        });
      }
      itemKeys.add(key);
    }

    // 4) Start transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const orderItems = [];
    let orderTotal = 0;

    // 5) Validate every item and calculate totals
    for (const item of items) {
      const qty = Number(item.quantity);

      // Check product exists and is active
      const [productCheck] = await connection.query(
        "SELECT product_id, isActive FROM products WHERE product_id = ?",
        [item.product_id]
      );

      if (productCheck.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: `Product not found: product_id ${item.product_id}`
        });
      }

      if (productCheck[0].isActive !== 'active') {
        await connection.rollback();
        return res.status(400).json({
          message: `Product is not available: product_id ${item.product_id}`
        });
      }

      const [rows] = await connection.query(
        `
        SELECT 
          p.product_id,
          p.name,
          p.price,
          ps.size_id,
          ps.size_value,
          ps.stock
        FROM products p
        INNER JOIN product_sizes ps
          ON p.product_id = ps.product_id
        WHERE p.product_id = ? AND ps.size_value = ? AND p.isActive = 'active'
        `,
        [item.product_id, item.size_value.trim()]
      );

      if (rows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: `Size '${item.size_value}' not found for product_id ${item.product_id}`
        });
      }

      const productRow = rows[0];

      // Stock validation
      if (productRow.stock < qty) {
        await connection.rollback();
        return res.status(400).json({
          message: `Insufficient stock for "${productRow.name}" (size: ${item.size_value})`,
          available_stock: productRow.stock,
          requested_quantity: qty
        });
      }

      const unitPrice = Number(productRow.price);

      if (isNaN(unitPrice) || unitPrice <= 0) {
        await connection.rollback();
        return res.status(500).json({ 
          message: "Invalid product price in database" 
        });
      }

      const lineTotal = Number((unitPrice * qty).toFixed(2));
      orderTotal += lineTotal;

      orderItems.push({
        product_id: productRow.product_id,
        size_id: productRow.size_id,
        product_name: productRow.name,
        size_value: productRow.size_value,
        unit_price: unitPrice,
        quantity: qty,
        line_total: lineTotal
      });
    }

    // Validate order total
    if (orderTotal <= 0) {
      await connection.rollback();
      return res.status(400).json({ 
        message: "Order total must be greater than 0" 
      });
    }

    // Optional: Maximum order limit
    if (orderTotal > 1000000) {
      await connection.rollback();
      return res.status(400).json({ 
        message: "Order total exceeds maximum limit" 
      });
    }

    // 6) Insert order header
    const [orderResult] = await connection.query(
      `
      INSERT INTO orders
        (user_id, customer_name, customer_phone, customer_address, status, total, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        fullName || null,
        customer_phone.trim(),
        customer_address.trim(),
        "processing",
        Number(orderTotal.toFixed(2)),
        description ? description.trim() : null
      ]
    );

    const orderId = orderResult.insertId;

    // 7) Insert all items + update stock
    for (const oi of orderItems) {
      await connection.query(
        `
        INSERT INTO order_items
          (order_id, product_id, size_id, product_name, price, quantity, line_total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          oi.product_id,
          oi.size_id,
          oi.product_name,
          oi.unit_price,
          oi.quantity,
          oi.line_total
        ]
      );

      await connection.query(
        `UPDATE product_sizes SET stock = stock - ? WHERE size_id = ?`,
        [oi.quantity, oi.size_id]
      );
    }

    // 8) Commit transaction
    await connection.commit();

    return res.status(201).json({
      message: "Order created successfully",
      order_id: orderId,
      customer_name: fullName,
      total: Number(orderTotal.toFixed(2)),
      items: orderItems
    });

  } catch (error) {
    console.error("Error creating order:", error.message, error);

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr.message, rollbackErr);
      }
    }

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// ==========================
// VIEW MY ORDERS (Customer)
// ==========================
export async function View_My_Orders(req, res) {
  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const userId = user.userid;

    // Validate userId
    if (!validateUserId(userId)) {
      return res.status(400).json({ 
        message: "Invalid user ID" 
      });
    }

    const customer = await isCustomer(userId);
    if (!customer) {
      return res.status(403).json({ 
        message: "Only customers can view their orders" 
      });
    }

    const sql = `
      SELECT
        o.order_id,
        o.user_id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.status,
        o.total,
        o.description,
        o.order_date,
        oi.order_item_id,
        oi.product_id,
        oi.size_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.line_total,
        ps.size_value
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC, o.order_id DESC, oi.order_item_id
    `;

    const [rows] = await pool.query(sql, [userId]);

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    const ordersMap = new Map();

    for (const row of rows) {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          order_id: row.order_id,
          customer_name: row.customer_name,
          customer_phone: row.customer_phone,
          customer_address: row.customer_address,
          status: row.status,
          total: row.total,
          description: row.description,
          order_date: row.order_date,
          items: []
        });
      }

      if (row.order_item_id) {
        const order = ordersMap.get(row.order_id);
        order.items.push({
          order_item_id: row.order_item_id,
          product_id: row.product_id,
          product_name: row.product_name,
          size_id: row.size_id,
          size_value: row.size_value,
          price: row.price,
          quantity: row.quantity,
          line_total: row.line_total
        });
      }
    }

    const orders = Array.from(ordersMap.values());

    return res.status(200).json(orders);

  } catch (error) {
    console.error("Error fetching my orders:", error.message, error);
    return res.status(500).json({
      message: "Error fetching orders",
      error: error.message
    });
  }
}

// ==========================
// VIEW ADMIN ORDERS
// ==========================
export async function View_Admin_Orders(req, res) {
  try {
    const user = req.user;

    // Validate admin access
    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const admin = await isAdmin(user.userid);
    if (!admin) {
      return res.status(403).json({ 
        message: "Only admin can view all orders" 
      });
    }

    const sql = `
      SELECT
        o.order_id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.status,
        o.total,
        o.order_date,
        oi.order_item_id,
        oi.product_id,
        oi.size_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.line_total,
        ps.size_value,
        p.images
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      ORDER BY o.order_date DESC, o.order_id DESC
    `;

    const [rows] = await pool.query(sql);

    const map = new Map();

    for (const r of rows) {
      if (!map.has(r.order_id)) {
        map.set(r.order_id, {
          order_id: r.order_id,
          customer_name: r.customer_name,
          customer_phone: r.customer_phone,
          customer_address: r.customer_address,
          status: r.status,
          total: r.total,
          order_date: r.order_date,
          items: []
        });
      }

      if (r.order_item_id) {
        let images = [];
        try {
          images = r.images ? JSON.parse(r.images) : [];
        } catch (e) {
          images = [];
        }

        map.get(r.order_id).items.push({
          product_id: r.product_id,
          size_id: r.size_id,
          product_name: r.product_name,
          size_value: r.size_value,
          quantity: r.quantity,
          price: r.price,
          line_total: r.line_total,
          image: images[0] || null
        });
      }
    }

    return res.status(200).json([...map.values()]);

  } catch (err) {
    console.error("Error loading admin orders:", err);
    return res.status(500).json({ message: "Error loading orders" });
  }
}

// ==========================
// VIEW ORDERS BY USER ID
// ==========================
export async function View_Orders_ByUser(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!validateUserId(user_id)) {
      return res.status(400).json({ 
        message: "Invalid User ID. Must be a positive integer" 
      });
    }

    // Check if user exists
    const [userCheck] = await pool.query(
      "SELECT userid FROM users WHERE userid = ?",
      [user_id]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const sql = `
      SELECT
        o.order_id,
        o.user_id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.status,
        o.total,
        o.order_date,
        oi.order_item_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.line_total,
        ps.size_value,
        p.images
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC, o.order_id DESC
    `;

    const [rows] = await pool.query(sql, [user_id]);

    const map = new Map();

    for (const r of rows) {
      if (!map.has(r.order_id)) {
        map.set(r.order_id, {
          order_id: r.order_id,
          user_id: r.user_id,
          customer_name: r.customer_name,
          customer_phone: r.customer_phone,
          customer_address: r.customer_address,
          status: r.status,
          total: r.total,
          order_date: r.order_date,
          items: []
        });
      }

      if (r.order_item_id) {
        let images = [];
        try {
          images = r.images ? JSON.parse(r.images) : [];
        } catch (e) {
          images = [];
        }

        map.get(r.order_id).items.push({
          product_name: r.product_name,
          size_value: r.size_value,
          quantity: r.quantity,
          price: r.price,
          line_total: r.line_total,
          image: images[0] || null
        });
      }
    }

    return res.status(200).json([...map.values()]);

  } catch (err) {
    console.error("Error loading orders by user:", err);
    return res.status(500).json({ message: "Error loading orders" });
  }
}

// ==========================
// ACCEPT ORDER (Admin)
// ==========================
export async function Accept_Order(req, res) {
  let connection;

  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const admin = await isAdmin(user.userid);
    if (!admin) {
      return res.status(403).json({ 
        message: "Only admin can accept orders" 
      });
    }

    const { order_id } = req.params;

    // Validate order_id
    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    if (!validateOrderId(order_id)) {
      return res.status(400).json({ 
        message: "Invalid Order ID. Must be a positive integer" 
      });
    }

    connection = await pool.getConnection();

    const [rows] = await connection.query(
      "SELECT status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = rows[0].status;

    if (currentStatus === "cancelled") {
      return res.status(400).json({
        message: "Cannot accept a cancelled order"
      });
    }

    if (currentStatus === "completed") {
      return res.status(400).json({
        message: "Order is already completed"
      });
    }

    if (currentStatus === "delivering") {
      return res.status(400).json({
        message: "Order is already in delivering status"
      });
    }

    if (currentStatus !== "processing") {
      return res.status(400).json({
        message: "Only orders in 'processing' status can be accepted"
      });
    }

    await connection.query(
      "UPDATE orders SET status = 'delivering' WHERE order_id = ?",
      [order_id]
    );

    return res.status(200).json({
      message: "Order accepted successfully. Status changed to delivering."
    });

  } catch (error) {
    console.error("Error accepting order:", error);
    return res.status(500).json({
      message: "Error accepting order",
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
}

// ==========================
// COMPLETE ORDER (Delivery)
// ==========================
export async function Complete_Order(req, res) {
  let connection;

  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({
        message: "Unauthorized: user not found in token"
      });
    }

    const userId = user.userid;

    const deliveryPerson = await isDelivery(userId);
    if (!deliveryPerson) {
      return res.status(403).json({
        message: "Only delivery staff can complete orders"
      });
    }

    const { order_id } = req.params;

    // Validate order_id
    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    if (!validateOrderId(order_id)) {
      return res.status(400).json({ 
        message: "Invalid Order ID. Must be a positive integer" 
      });
    }

    connection = await pool.getConnection();

    const [rows] = await connection.query(
      "SELECT status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = rows[0].status;

    if (currentStatus === "cancelled") {
      return res.status(400).json({
        message: "Cannot complete a cancelled order"
      });
    }

    if (currentStatus === "completed") {
      return res.status(400).json({
        message: "Order is already completed"
      });
    }

    if (currentStatus === "processing") {
      return res.status(400).json({
        message: "Order must be accepted by admin first"
      });
    }

    if (currentStatus !== "delivering") {
      return res.status(400).json({
        message: "Only orders in 'delivering' status can be completed"
      });
    }

    await connection.query(
      "UPDATE orders SET status = 'completed' WHERE order_id = ?",
      [order_id]
    );

    return res.status(200).json({
      message: "Order completed successfully."
    });

  } catch (error) {
    console.error("Error completing order:", error);
    return res.status(500).json({
      message: "Error completing order",
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
}

// ==========================
// VIEW DELIVERY ORDERS
// ==========================
export async function View_Delivery_Orders(req, res) {
  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const deliveryPerson = await isDelivery(user.userid);
    if (!deliveryPerson) {
      return res.status(403).json({ 
        message: "Only delivery staff can view delivery orders" 
      });
    }

    const sql = `
      SELECT
        o.order_id,
        o.user_id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.status,
        o.total,
        o.order_date,
        oi.order_item_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.line_total,
        ps.size_value,
        p.images
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.status = 'delivering'
      ORDER BY o.order_date DESC, o.order_id DESC
    `;

    const [rows] = await pool.query(sql);

    const map = new Map();

    for (const r of rows) {
      if (!map.has(r.order_id)) {
        map.set(r.order_id, {
          order_id: r.order_id,
          user_id: r.user_id,
          customer_name: r.customer_name,
          customer_phone: r.customer_phone,
          customer_address: r.customer_address,
          status: r.status,
          total: r.total,
          order_date: r.order_date,
          items: []
        });
      }

      if (r.order_item_id) {
        let images = [];
        try {
          images = r.images ? JSON.parse(r.images) : [];
        } catch (e) {
          images = [];
        }

        map.get(r.order_id).items.push({
          product_name: r.product_name,
          size_value: r.size_value,
          quantity: r.quantity,
          price: r.price,
          line_total: r.line_total,
          image: images[0] || null
        });
      }
    }

    return res.status(200).json([...map.values()]);

  } catch (err) {
    console.error("Error loading delivery orders:", err);
    return res.status(500).json({ message: "Error loading delivery orders" });
  }
}

// ==========================
// CANCEL ORDER (Customer)
// ==========================
export async function Cancel_Order(req, res) {
  let connection;

  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({
        message: "Unauthorized: user not found in token"
      });
    }

    const userId = user.userid;

    const customer = await isCustomer(userId);
    if (!customer) {
      return res.status(403).json({
        message: "Only customers can cancel orders"
      });
    }

    const { order_id } = req.params;

    // Validate order_id
    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    if (!validateOrderId(order_id)) {
      return res.status(400).json({ 
        message: "Invalid Order ID. Must be a positive integer" 
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query(
      "SELECT user_id, status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    const order = rows[0];

    if (order.user_id !== userId) {
      await connection.rollback();
      return res.status(403).json({
        message: "You can only cancel your own orders"
      });
    }

    if (order.status === "cancelled") {
      await connection.rollback();
      return res.status(400).json({
        message: "Order is already cancelled"
      });
    }

    if (order.status === "completed") {
      await connection.rollback();
      return res.status(400).json({
        message: "Cannot cancel a completed order"
      });
    }

    if (order.status === "delivering") {
      await connection.rollback();
      return res.status(400).json({
        message: "Cannot cancel an order that is already being delivered"
      });
    }

    if (order.status !== "processing") {
      await connection.rollback();
      return res.status(400).json({
        message: "You can cancel only orders that are in 'processing' status"
      });
    }

    // Return stock to product_sizes table
    const [items] = await connection.query(
      "SELECT product_id, size_id, quantity FROM order_items WHERE order_id = ?",
      [order_id]
    );

    for (const item of items) {
      await connection.query(
        `UPDATE product_sizes
         SET stock = stock + ?
         WHERE product_id = ? AND size_id = ?`,
        [item.quantity, item.product_id, item.size_id]
      );
    }

    await connection.query(
      "UPDATE orders SET status = 'cancelled' WHERE order_id = ?",
      [order_id]
    );

    await connection.commit();

    return res.status(200).json({
      message: "Order cancelled successfully"
    });

  } catch (error) {
    console.error("Error cancelling order:", error);

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }

    return res.status(500).json({
      message: "Error cancelling order",
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
}

// ==========================
// TOTAL ORDER COUNT
// ==========================
export async function Total_Order_Count(req, res) {
  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const admin = await isAdmin(user.userid);
    if (!admin) {
      return res.status(403).json({ 
        message: "Only admin can view order statistics" 
      });
    }

    const [rows] = await pool.query(`
      SELECT COUNT(*) AS total_orders
      FROM orders
    `);

    return res.status(200).json({
      total_orders: rows[0].total_orders
    });

  } catch (error) {
    console.error("Error fetching total order count:", error);
    return res.status(500).json({
      message: "Error fetching total order count",
      error: error.message
    });
  }
}

// ==========================
// PROCESSING ORDER COUNT
// ==========================
export async function Processing_Order_Count(req, res) {
  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const admin = await isAdmin(user.userid);
    if (!admin) {
      return res.status(403).json({ 
        message: "Only admin can view order statistics" 
      });
    }

    const [rows] = await pool.query(`
      SELECT COUNT(*) AS processing_orders
      FROM orders
      WHERE status = 'processing'
    `);

    return res.status(200).json({
      processing_orders: rows[0].processing_orders
    });

  } catch (error) {
    console.error("Error fetching processing order count:", error);
    return res.status(500).json({
      message: "Error fetching processing count",
      error: error.message
    });
  }
}

// ==========================
// RECENT FOUR ORDERS
// ==========================
export async function Recent_Four_Orders(req, res) {
  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const admin = await isAdmin(user.userid);
    if (!admin) {
      return res.status(403).json({ 
        message: "Only admin can view recent orders" 
      });
    }

    const [rows] = await pool.query(`
      SELECT 
        o.order_id,
        o.total,
        o.status,
        o.order_date,
        u.firstname,
        u.lastname
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.userid
      ORDER BY o.order_date DESC, o.order_id DESC
      LIMIT 4
    `);

    const data = rows.map(r => ({
      order_id: r.order_id,
      firstname: r.firstname || null,
      lastname: r.lastname || null,
      total: r.total,
      status: r.status,
      order_date: r.order_date
    }));

    return res.status(200).json(data);

  } catch (error) {
    console.error("Error fetching recent 4 orders:", error);
    return res.status(500).json({
      message: "Error fetching recent orders",
      error: error.message
    });
  }
}

// ==========================
// GET USER ORDER STATS
// ==========================
export async function Get_User_Order_Stats(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!validateUserId(user_id)) {
      return res.status(400).json({ 
        message: "Invalid User ID. Must be a positive integer" 
      });
    }

    // Check if user exists
    const [userCheck] = await pool.query(
      "SELECT userid FROM users WHERE userid = ?",
      [user_id]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [countRows] = await pool.query(
      `
      SELECT
        COUNT(*) AS total_orders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) AS processing_orders,
        SUM(CASE WHEN status = 'delivering' THEN 1 ELSE 0 END) AS delivering_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
      FROM orders
      WHERE user_id = ?
      `,
      [user_id]
    );

    const [recentRows] = await pool.query(
      `
      SELECT 
        o.order_id,
        o.total,
        o.status,
        o.order_date,
        u.firstname,
        u.lastname
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.userid
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC, o.order_id DESC
      LIMIT 4
      `,
      [user_id]
    );

    const recent_orders = recentRows.map((r) => ({
      order_id: r.order_id,
      total: r.total,
      status: r.status,
      order_date: r.order_date,
      firstname: r.firstname,
      lastname: r.lastname,
    }));

    return res.status(200).json({
      counts: {
        total_orders: countRows[0].total_orders || 0,
        processing_orders: countRows[0].processing_orders || 0,
        delivering_orders: countRows[0].delivering_orders || 0,
        completed_orders: countRows[0].completed_orders || 0,
        cancelled_orders: countRows[0].cancelled_orders || 0,
      },
      recent_orders,
    });

  } catch (error) {
    console.error("Error fetching user order stats:", error);
    return res.status(500).json({
      message: "Error fetching user order stats",
      error: error.message,
    });
  }
}

// ==========================
// GET ORDER SUMMARY
// ==========================
export async function Get_Order_Summary(req, res) {
  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const [countRows] = await pool.query(`
      SELECT 
        SUM(status = 'delivering') AS delivering_count,
        SUM(status = 'completed') AS completed_count,
        SUM(status = 'processing') AS processing_count,
        SUM(status = 'cancelled') AS cancelled_count
      FROM orders
    `);

    const [recentRows] = await pool.query(`
      SELECT 
        order_id,
        customer_name,
        total,
        status,
        order_date
      FROM orders
      WHERE status IN ('delivering', 'completed')
      ORDER BY order_date DESC
      LIMIT 4
    `);

    const recentOrders = recentRows.map(row => {
      const parts = row.customer_name?.split(" ") || [];
      return {
        order_id: row.order_id,
        firstname: parts[0] || "",
        lastname: parts.slice(1).join(" ") || "",
        total: row.total,
        status: row.status,
        order_date: row.order_date
      };
    });

    return res.status(200).json({
      delivering_count: countRows[0].delivering_count || 0,
      completed_count: countRows[0].completed_count || 0,
      processing_count: countRows[0].processing_count || 0,
      cancelled_count: countRows[0].cancelled_count || 0,
      recent_orders: recentOrders
    });

  } catch (error) {
    console.error("Error fetching order summary:", error);
    return res.status(500).json({
      message: "Error fetching order summary",
      error: error.message
    });
  }
}

// ==========================
// VIEW COMPLETED ORDERS
// ==========================
export async function View_Completed_Orders(req, res) {
  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ 
        message: "Unauthorized: user not found in token" 
      });
    }

    const sql = `
      SELECT
        o.order_id,
        o.user_id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.status,
        o.total,
        o.order_date,
        oi.order_item_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.line_total,
        ps.size_value,
        p.images
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.status = 'completed'
      ORDER BY o.order_date DESC, o.order_id DESC
    `;

    const [rows] = await pool.query(sql);

    const map = new Map();

    for (const r of rows) {
      if (!map.has(r.order_id)) {
        map.set(r.order_id, {
          order_id: r.order_id,
          user_id: r.user_id,
          customer_name: r.customer_name,
          customer_phone: r.customer_phone,
          customer_address: r.customer_address,
          status: r.status,
          total: r.total,
          order_date: r.order_date,
          items: []
        });
      }

      if (r.order_item_id) {
        let images = [];
        try {
          images = r.images ? JSON.parse(r.images) : [];
        } catch (e) {
          images = [];
        }

        map.get(r.order_id).items.push({
          product_id: r.product_id,
          product_name: r.product_name,
          size_value: r.size_value,
          quantity: r.quantity,
          price: r.price,
          line_total: r.line_total,
          image: images[0] || null
        });
      }
    }

    return res.status(200).json([...map.values()]);

  } catch (err) {
    console.error("Error loading completed orders:", err);
    return res.status(500).json({ message: "Error loading completed orders" });
  }
}