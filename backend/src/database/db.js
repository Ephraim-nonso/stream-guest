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

  // Create scheduled_calls table
  db.exec(`
    CREATE TABLE IF NOT EXISTS scheduled_calls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientAddress TEXT NOT NULL,
      expertAddress TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration INTEGER NOT NULL DEFAULT 60,
      hourlyRate REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'pending_changes', 'confirmed', 'cancelled', 'completed')),
      topics TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      confirmedAt TEXT,
      proposedDate TEXT,
      proposedTime TEXT,
      proposedDuration INTEGER,
      proposedTopics TEXT,
      FOREIGN KEY (clientAddress) REFERENCES users(address),
      FOREIGN KEY (expertAddress) REFERENCES users(address)
    )
  `);

  // Add new columns if they don't exist (migration for existing databases)
  try {
    // Check if proposedDate column exists
    const tableInfo = db.prepare("PRAGMA table_info(scheduled_calls)").all();
    const columnNames = tableInfo.map(col => col.name);
    
    if (!columnNames.includes('proposedDate')) {
      console.log('Adding proposedDate column to scheduled_calls table...');
      db.exec(`ALTER TABLE scheduled_calls ADD COLUMN proposedDate TEXT`);
    }
    
    if (!columnNames.includes('proposedTime')) {
      console.log('Adding proposedTime column to scheduled_calls table...');
      db.exec(`ALTER TABLE scheduled_calls ADD COLUMN proposedTime TEXT`);
    }
    
    if (!columnNames.includes('proposedDuration')) {
      console.log('Adding proposedDuration column to scheduled_calls table...');
      db.exec(`ALTER TABLE scheduled_calls ADD COLUMN proposedDuration INTEGER`);
    }
    
    if (!columnNames.includes('proposedTopics')) {
      console.log('Adding proposedTopics column to scheduled_calls table...');
      db.exec(`ALTER TABLE scheduled_calls ADD COLUMN proposedTopics TEXT`);
    }

    // Update status constraint if needed (SQLite doesn't support ALTER CHECK, so we'll handle this in application)
    // The status check is only enforced on new inserts/updates, existing data might have old status values
  } catch (error) {
    console.error('Error migrating scheduled_calls table:', error);
    // Continue anyway - the columns might already exist
  }

  // Create indexes for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_scheduled_calls_client ON scheduled_calls(clientAddress)
  `);
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_scheduled_calls_expert ON scheduled_calls(expertAddress)
  `);
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_scheduled_calls_status ON scheduled_calls(status)
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
