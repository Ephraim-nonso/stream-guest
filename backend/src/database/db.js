import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_DIR = path.join(__dirname, "../../data");
const DB_FILE = path.join(DB_DIR, "users.db");

/**
 * Initialize and return database connection
 */
export const getDB = () => {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    console.log("Created data directory");
  }

  const db = new Database(DB_FILE);

  // Enable foreign keys
  db.pragma("foreign_keys = ON");

  return db;
};

/**
 * Initialize database schema
 */
export const initializeDatabase = () => {
  const db = getDB();

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      address TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK(role IN ('expert', 'client')),
      fullName TEXT NOT NULL,
      professionalTitle TEXT,
      areaOfExpertise TEXT,
      hourlyRate REAL DEFAULT 0,
      company TEXT,
      registeredAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create index on role for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
  `);

  console.log("Database initialized");
  db.close();
};

/**
 * Close database connection
 */
export const closeDB = (db) => {
  if (db) {
    db.close();
  }
};
