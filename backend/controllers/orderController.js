
import {  isAdmin, isCustomer } from "./userController.js";
import { pool } from "../db.js";


export async function Make_Order(req, res) {
  let connection;

  try {
    // 1) Get user info from token
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ message: "Unauthorized: user not found in token" });
    }

    const userId = user.userid;

    // Build full name safely
    let firstName = user.firstname || "";
    let lastName = user.lastname || "";

    if (!firstName && !lastName) {
      const [userRows] = await pool.query(
        "SELECT firstname, lastname FROM users WHERE userid = ?",
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
      return res.status(403).json({ message: "Only customers can place orders" });
    }

    // 3) Read data
    const { customer_address, customer_phone, description, items } = req.body;

    if (!customer_address || !customer_phone) {
      return res.status(400).json({ message: "customer_address and customer_phone are required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items array is required and cannot be empty" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.product_id || !item.size_value || item.quantity == null) {
        return res.status(400).json({
          message: "Each item must have product_id, size_value and quantity"
        });
      }
      const qty = Number(item.quantity);
      if (Number.isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          message: "Each item quantity must be a positive number"
        });
      }
    }

    // 4) Start transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const orderItems = [];
    let orderTotal = 0;

    // 5) Validate every item and calculate totals
    for (const item of items) {
      const qty = Number(item.quantity);

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
        WHERE p.product_id = ? AND ps.size_value = ?
        `,
        [item.product_id, item.size_value]
      );

      if (rows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: `Product or size not found for product_id ${item.product_id}, size_value ${item.size_value}`
        });
      }

      const productRow = rows[0];

      // Stock validation
      if (productRow.stock < qty) {
        await connection.rollback();
        return res.status(400).json({
          message: `Not enough stock for product_id ${item.product_id}, size ${item.size_value}`,
          available_stock: productRow.stock
        });
      }

      const unitPrice = Number(productRow.price);

      if (Number.isNaN(unitPrice)) {
        await connection.rollback();
        return res.status(500).json({ message: "Invalid product price in database" });
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
        customer_phone,
        customer_address,
        "processing",
        Number(orderTotal.toFixed(2)),
        description || null
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


// ... Make_Order here ...

export async function View_My_Orders(req, res) {
  try {
    // 1) Get user from token
    const user = req.user;
    if (!user || !user.userid) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found in token" });
    }

    const userId = user.userid;

    // 2) Check role (only customers)
    const customer = await isCustomer(userId);
    if (!customer) {
      return res
        .status(403)
        .json({ message: "Only customers can view their orders" });
    }

    // 3) Load orders + items for this user
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
      LEFT JOIN order_items oi
        ON o.order_id = oi.order_id
      LEFT JOIN product_sizes ps
        ON oi.size_id = ps.size_id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC, o.order_id DESC, oi.order_item_id
    `;

    const [rows] = await pool.query(sql, [userId]);

    if (rows.length === 0) {
      // No orders for this user
      return res.status(200).json([]);
    }

    // 4) Group rows by order_id
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


export async function View_Admin_Orders(req, res) {
  try {
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
        const images = r.images ? JSON.parse(r.images) : [];

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
    console.log(err);
    return res.status(500).json({ message: "Error loading orders" });
  }
}

export async function View_Orders_ByUser(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
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

    // GROUP ORDERS
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
        const images = r.images ? JSON.parse(r.images) : [];

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


export async function Accept_Order(req, res) {
  let connection;

  try {
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({ message: "Unauthorized: user not found in token" });
    }

    const admin = await isAdmin(user.userid);
    if (!admin) {
      return res.status(403).json({ message: "Only admin can accept orders" });
    }

    // 👉 Safely parse order id
    const rawId = req.params.order_id;
    const orderId = Number(rawId);

    if (!orderId || Number.isNaN(orderId)) {
      console.error("Accept_Order invalid order_id:", rawId);
      return res.status(400).json({ message: "Valid Order ID is required" });
    }

    connection = await pool.getConnection();

    // 4) check order exists
    const [rows] = await connection.query(
      "SELECT status FROM orders WHERE order_id = ?",
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = rows[0].status;

    if (currentStatus !== "processing") {
      return res.status(400).json({
        message: "Only orders in 'processing' status can be accepted"
      });
    }

    await connection.query(
      "UPDATE orders SET status = 'delivering' WHERE order_id = ?",
      [orderId]
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


export async function Complete_Order(req, res) {
  let connection;

  try {
    // 1) Check token
    const user = req.user;

    if (!user || !user.userid) {
      return res.status(401).json({
        message: "Unauthorized: user not found in token"
      });
    }

    const userId = user.userid;

    // 2) Check role: only delivery staff can complete orders
    const deliveryPerson = await isDelivery(userId);
    if (!deliveryPerson) {
      return res.status(403).json({
        message: "Only delivery staff can complete orders"
      });
    }

    // 3) Get order ID
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        message: "Order ID is required"
      });
    }

    connection = await pool.getConnection();

    // 4) Check order exists and get current status
    const [rows] = await connection.query(
      "SELECT status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const currentStatus = rows[0].status;

    if (currentStatus !== "delivering") {
      return res.status(400).json({
        message: "Only orders in 'delivering' status can be completed"
      });
    }

    // 5) Update order status to completed
    await connection.query(
      "UPDATE orders SET status = 'completed' WHERE order_id = ?",
      [order_id]
    );

    return res.status(200).json({
      message: "Order completed successfully."
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error completing order",
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
}