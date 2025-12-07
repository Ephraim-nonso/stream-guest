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

/**
 * Create a new scheduled call
 */
export const createScheduledCall = (callData) => {
  const db = getDB();
  try {
    const stmt = db.prepare(`
      INSERT INTO scheduled_calls (
        clientAddress, expertAddress, date, time, duration, 
        hourlyRate, status, topics, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const now = new Date().toISOString();
    const result = stmt.run(
      callData.clientAddress.toLowerCase(),
      callData.expertAddress.toLowerCase(),
      callData.date,
      callData.time,
      callData.duration || 60,
      callData.hourlyRate,
      callData.status || 'pending',
      callData.topics ? JSON.stringify(callData.topics) : null,
      now,
      now
    );
    
    // Get the created call
    const getStmt = db.prepare('SELECT * FROM scheduled_calls WHERE id = ?');
    const call = getStmt.get(result.lastInsertRowid);
    
    // Parse topics if present
    if (call.topics) {
      call.topics = JSON.parse(call.topics);
    } else {
      call.topics = [];
    }
    
    console.log(`Created scheduled call: ${call.id}`);
    return call;
  } catch (error) {
    console.error('Error creating scheduled call:', error);
    throw error;
  } finally {
    db.close();
  }
};

/**
 * Get scheduled calls by client address
 */
export const getScheduledCallsByClient = (clientAddress) => {
  const db = getDB();
  try {
    const stmt = db.prepare(`
      SELECT sc.*, 
             u1.fullName as expertName, u1.areaOfExpertise,
             u2.fullName as clientName
      FROM scheduled_calls sc
      LEFT JOIN users u1 ON sc.expertAddress = u1.address
      LEFT JOIN users u2 ON sc.clientAddress = u2.address
      WHERE sc.clientAddress = ?
      ORDER BY sc.date DESC, sc.time DESC
    `);
    
    const calls = stmt.all(clientAddress.toLowerCase());
    
    // Parse topics for each call
    return calls.map(call => {
      const parsed = {
        ...call,
        topics: call.topics ? JSON.parse(call.topics) : []
      };
      
      if (call.proposedTopics) {
        parsed.proposedTopics = JSON.parse(call.proposedTopics);
      } else {
        parsed.proposedTopics = [];
      }
      
      return parsed;
    });
  } catch (error) {
    console.error('Error getting scheduled calls by client:', error);
    return [];
  } finally {
    db.close();
  }
};

/**
 * Get scheduled calls by expert address
 */
export const getScheduledCallsByExpert = (expertAddress) => {
  const db = getDB();
  try {
    const stmt = db.prepare(`
      SELECT sc.*, 
             u1.fullName as expertName,
             u2.fullName as clientName, u2.company as organization
      FROM scheduled_calls sc
      LEFT JOIN users u1 ON sc.expertAddress = u1.address
      LEFT JOIN users u2 ON sc.clientAddress = u2.address
      WHERE sc.expertAddress = ?
      ORDER BY sc.date DESC, sc.time DESC
    `);
    
    const calls = stmt.all(expertAddress.toLowerCase());
    
    // Parse topics for each call
    return calls.map(call => {
      const parsed = {
        ...call,
        topics: call.topics ? JSON.parse(call.topics) : []
      };
      
      if (call.proposedTopics) {
        parsed.proposedTopics = JSON.parse(call.proposedTopics);
      } else {
        parsed.proposedTopics = [];
      }
      
      return parsed;
    });
  } catch (error) {
    console.error('Error getting scheduled calls by expert:', error);
    return [];
  } finally {
    db.close();
  }
};

/**
 * Confirm a scheduled call
 */
export const confirmScheduledCall = (callId) => {
  const db = getDB();
  try {
    const stmt = db.prepare(`
      UPDATE scheduled_calls 
      SET status = 'confirmed', 
          confirmedAt = ?,
          updatedAt = ?
      WHERE id = ?
    `);
    
    const now = new Date().toISOString();
    const result = stmt.run(now, now, callId);
    
    if (result.changes === 0) {
      return false;
    }
    
    // Get the updated call
    const getStmt = db.prepare(`
      SELECT sc.*, 
             u1.fullName as expertName, u1.areaOfExpertise,
             u2.fullName as clientName
      FROM scheduled_calls sc
      LEFT JOIN users u1 ON sc.expertAddress = u1.address
      LEFT JOIN users u2 ON sc.clientAddress = u2.address
      WHERE sc.id = ?
    `);
    const call = getStmt.get(callId);
    
    if (call && call.topics) {
      call.topics = JSON.parse(call.topics);
    } else if (call) {
      call.topics = [];
    }
    
    console.log(`Confirmed scheduled call: ${callId}`);
    return call;
  } catch (error) {
    console.error('Error confirming scheduled call:', error);
    throw error;
  } finally {
    db.close();
  }
};

/**
 * Get scheduled call by ID
 */
export const getScheduledCallById = (callId) => {
  const db = getDB();
  try {
    const stmt = db.prepare(`
      SELECT sc.*, 
             u1.fullName as expertName, u1.areaOfExpertise,
             u2.fullName as clientName, u2.company as organization
      FROM scheduled_calls sc
      LEFT JOIN users u1 ON sc.expertAddress = u1.address
      LEFT JOIN users u2 ON sc.clientAddress = u2.address
      WHERE sc.id = ?
    `);
    
    const call = stmt.get(callId);
    
    if (call) {
      if (call.topics) {
        call.topics = JSON.parse(call.topics);
      } else {
        call.topics = [];
      }
      
      if (call.proposedTopics) {
        call.proposedTopics = JSON.parse(call.proposedTopics);
      } else {
        call.proposedTopics = [];
      }
    }
    
    return call || null;
  } catch (error) {
    console.error('Error getting scheduled call by ID:', error);
    return null;
  } finally {
    db.close();
  }
};

/**
 * Update a scheduled call with proposed changes
 */
export const updateScheduledCall = (callId, updates) => {
  const db = getDB();
  try {
    const updateFields = [];
    const values = [];
    
    if (updates.proposedDate !== undefined) {
      updateFields.push('proposedDate = ?');
      values.push(updates.proposedDate);
    }
    
    if (updates.proposedTime !== undefined) {
      updateFields.push('proposedTime = ?');
      values.push(updates.proposedTime);
    }
    
    if (updates.proposedDuration !== undefined) {
      updateFields.push('proposedDuration = ?');
      values.push(updates.proposedDuration);
    }
    
    if (updates.proposedTopics !== undefined) {
      updateFields.push('proposedTopics = ?');
      values.push(updates.proposedTopics ? JSON.stringify(updates.proposedTopics) : null);
    }
    
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      values.push(updates.status);
    }
    
    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }
    
    updateFields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(callId);
    
    const stmt = db.prepare(`
      UPDATE scheduled_calls 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    
    const result = stmt.run(...values);
    
    if (result.changes === 0) {
      return false;
    }
    
    // Get the updated call
    const call = getScheduledCallById(callId);
    console.log(`Updated scheduled call: ${callId}`);
    return call;
  } catch (error) {
    console.error('Error updating scheduled call:', error);
    throw error;
  } finally {
    db.close();
  }
};

/**
 * Accept proposed changes (client confirms expert's changes)
 */
export const acceptProposedChanges = (callId) => {
  const db = getDB();
  try {
    // First get the call to check proposed changes
    const call = getScheduledCallById(callId);
    
    if (!call) {
      return false;
    }
    
    // Update with proposed values and set status to confirmed
    const stmt = db.prepare(`
      UPDATE scheduled_calls 
      SET 
        date = COALESCE(proposedDate, date),
        time = COALESCE(proposedTime, time),
        duration = COALESCE(proposedDuration, duration),
        topics = COALESCE(proposedTopics, topics),
        status = 'confirmed',
        confirmedAt = ?,
        updatedAt = ?,
        proposedDate = NULL,
        proposedTime = NULL,
        proposedDuration = NULL,
        proposedTopics = NULL
      WHERE id = ?
    `);
    
    const now = new Date().toISOString();
    const result = stmt.run(now, now, callId);
    
    if (result.changes === 0) {
      return false;
    }
    
    // Get the updated call
    const updatedCall = getScheduledCallById(callId);
    console.log(`Accepted proposed changes for call: ${callId}`);
    return updatedCall;
  } catch (error) {
    console.error('Error accepting proposed changes:', error);
    throw error;
  } finally {
    db.close();
  }
};

