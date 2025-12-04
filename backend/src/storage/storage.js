import { getDB, initializeDatabase } from '../database/db.js';

/**
 * Initialize storage - initialize database schema
 */
export const initializeStorage = () => {
  try {
    initializeDatabase();
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
};

/**
 * Save a new user
 */
export const saveUser = (user) => {
  const db = getDB();
  try {
    const stmt = db.prepare(`
      INSERT INTO users (
        address, role, fullName, professionalTitle, 
        areaOfExpertise, hourlyRate, company, registeredAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      user.address.toLowerCase(),
      user.role,
      user.fullName,
      user.professionalTitle || null,
      user.areaOfExpertise || null,
      user.hourlyRate || 0,
      user.company || null,
      user.registeredAt || new Date().toISOString(),
      user.updatedAt || new Date().toISOString()
    );
    
    console.log(`Saved user: ${user.address} (${user.role})`);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      throw new Error('User already exists');
    }
    throw error;
  } finally {
    db.close();
  }
};

/**
 * Get user by address
 */
export const getUser = (address) => {
  const db = getDB();
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE address = ?');
    const user = stmt.get(address.toLowerCase());
    return user || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  } finally {
    db.close();
  }
};

/**
 * Get all users
 */
export const getAllUsers = () => {
  const db = getDB();
  try {
    const stmt = db.prepare('SELECT * FROM users ORDER BY registeredAt DESC');
    const users = stmt.all();
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  } finally {
    db.close();
  }
};

/**
 * Update user
 */
export const updateUser = (updatedUser) => {
  const db = getDB();
  try {
    const stmt = db.prepare(`
      UPDATE users 
      SET 
        role = ?,
        fullName = ?,
        professionalTitle = ?,
        areaOfExpertise = ?,
        hourlyRate = ?,
        company = ?,
        updatedAt = ?
      WHERE address = ?
    `);
    
    const result = stmt.run(
      updatedUser.role,
      updatedUser.fullName,
      updatedUser.professionalTitle || null,
      updatedUser.areaOfExpertise || null,
      updatedUser.hourlyRate || 0,
      updatedUser.company || null,
      new Date().toISOString(),
      updatedUser.address.toLowerCase()
    );
    
    if (result.changes === 0) {
      return false;
    }
    
    console.log(`Updated user: ${updatedUser.address}`);
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  } finally {
    db.close();
  }
};

/**
 * Delete user
 */
export const deleteUser = (address) => {
  const db = getDB();
  try {
    const stmt = db.prepare('DELETE FROM users WHERE address = ?');
    const result = stmt.run(address.toLowerCase());
    
    if (result.changes === 0) {
      return false;
    }
    
    console.log(`Deleted user: ${address}`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  } finally {
    db.close();
  }
};

