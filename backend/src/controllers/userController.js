import { 
  saveUser, 
  getUser, 
  getAllUsers as getAllUsersFromStorage,
  updateUser as updateUserInStorage,
  deleteUser as deleteUserFromStorage 
} from '../storage/storage.js';

/**
 * Register a new user (expert or client)
 */
export const registerUser = async (req, res, next) => {
  try {
    const { address, role, ...userData } = req.body;

    // Validate required fields
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    if (!role || !['expert', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "expert" or "client"' });
    }

    // Check if user already exists
    const existingUser = getUser(address);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already registered',
        user: existingUser 
      });
    }

    // Create user object based on role
    let user;
    if (role === 'expert') {
      user = {
        address: address.toLowerCase(),
        role: 'expert',
        fullName: userData.fullName || '',
        professionalTitle: userData.professionalTitle || '',
        areaOfExpertise: userData.areaOfExpertise || '',
        hourlyRate: userData.hourlyRate ? parseFloat(userData.hourlyRate) : 0,
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      user = {
        address: address.toLowerCase(),
        role: 'client',
        fullName: userData.fullName || '',
        company: userData.company || '',
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Save user
    saveUser(user);

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by wallet address
 */
export const getUserByAddress = async (req, res, next) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const user = getUser(address.toLowerCase());
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users with optional filtering
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let users = getAllUsersFromStorage();

    // Filter by role if provided
    if (role && ['expert', 'client'].includes(role)) {
      users = users.filter(user => user.role === role);
    }

    res.json({ 
      count: users.length,
      users 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user information
 */
export const updateUser = async (req, res, next) => {
  try {
    const { address } = req.params;
    const updates = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const existingUser = getUser(address.toLowerCase());
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Merge updates with existing user data
    const updatedUser = {
      ...existingUser,
      ...updates,
      address: address.toLowerCase(), // Ensure address doesn't change
      updatedAt: new Date().toISOString()
    };

    updateUserInStorage(updatedUser);

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const user = getUser(address.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    deleteUserFromStorage(address.toLowerCase());

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

