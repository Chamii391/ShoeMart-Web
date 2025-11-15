import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create MySQL pool
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
export async function connectDB() {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        console.log("✅ Connected to MySQL database");
        connection.release();
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
}
